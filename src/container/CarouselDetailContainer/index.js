// @flow
import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Slide from "../../screens/CarouselDetail/Slide";
import Detail from "../../screens/CarouselDetail/Detail";
import Constants from "../../global/constants";
import { sliderWidth, itemWidth } from "../../screens/CarouselDetail/Slide.style";

export interface Props {
  navigator: any;
}
export interface State {
  currentSlide: number;
  _carouselRef: React.Component<Carousel>;
}

export default class CarouselDetailContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
  }

  _renderItem({ item, index }) {
    return <Slide data={item} even={(index + 1) % 2 === 0} />;
  }

  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <Slide
        data={item}
        even={(index + 1) % 2 === 0}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  _renderDetails(index) {
    const dataToRender = FLIGHT_DATA[index];
    return <Detail data={dataToRender} even={(this.state.currentSlide + 1) % 2 === 0} />;
  }

  render() {
    return (
      <ScrollView style={styles.scrollview} scrollEventThrottle={200} directionalLockEnabled={true}>
        <View style={styles.carouselContainer}>
          <Carousel
            //Here, pushing the ref into state and then reading from state into the other child(pagination).
            // Note: without the !this.state.one this will cause an infinite loop.
            ref={c => !this.state._carouselRef && this.setState({ _carouselRef: c })}
            data={FLIGHT_DATA}
            renderItem={this._renderItemWithParallax}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            hasParallaxImages={true}
            firstItem={0}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            // inactiveSlideShift={20}
            containerCustomStyle={styles.slider}
            contentContainerCustomStyle={styles.sliderContentContainer}
            loop={true}
            loopClonesPerSide={2}
            autoplay={false}
            autoplayDelay={500}
            autoplayInterval={3000}
            onSnapToItem={index => this.setState({ currentSlide: index })}
          />
          <Pagination
            dotsLength={FLIGHT_DATA.length}
            activeDotIndex={this.state.currentSlide}
            containerStyle={styles.paginationContainer}
            dotColor={"rgba(13, 109, 229, 0.95)"}
            dotStyle={styles.paginationDot}
            inactiveDotColor={Constants.Colors.black}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this.state._carouselRef}
            tappableDots={!!this.state._carouselRef}
          />
        </View>
        <View style={{ backgroundColor: "white", width: "100%", height: 5 }} />
        <View style={styles.detailsContainer}>{this._renderDetails(this.state.currentSlide)}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  carouselContainer: {
    flex: 1,
    backgroundColor: Constants.Colors.background,
    paddingBottom: 5,
  },
  slider: {
    marginTop: 5,
    overflow: "visible", // for custom animations
  },
  sliderContentContainer: {
    paddingTop: 10, // for custom animation
  },
  paginationContainer: {
    paddingVertical: 3,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: Constants.Colors.background,
    paddingBottom: 5,
  },
});

export const FLIGHT_DATA = [
  {
    title: "Boeing 737",
    subtitle: "First flight	 April 9, 1967",
    illustration: require("../../../assets/img/flight/Boe737.jpg"),
    body:
      "The Boeing 737 is a short- to medium-range twinjet narrow-body airliner developed and manufactured by Boeing Commercial Airplanes in the United States. Originally developed as a shorter, lower-cost twin-engine airliner derived from the 707 and 727, the 737 has developed into a family of ten passenger models with capacities from 85 to 215 passengers. The 737 is Boeing's only narrow-body airliner in production, with the 737 Next Generation (-700, -800, and -900ER) and the re-engined and redesigned 737 MAX variants currently being built. \n The 737 was originally envisioned in 1964. The initial 737-100 made its first flight in April 1967, and entered airline service in February 1968 at Lufthansa. Next, the lengthened 737-200 entered service in April 1968. In the 1980s Boeing launched the longer 737-300, −400, and −500 variants (referred to as the Boeing 737 Classic series) featuring CFM56 turbofan engines and wing improvements. The 737 series is the best-selling commercial jetliner in history.",
  },
  {
    title: "Boeing 747",
    subtitle: "First flight  February 9, 1969",
    illustration: require("../../../assets/img/flight/Boe747.jpg"),
    body:
      "The Boeing 747 is an American wide-body commercial jet airliner and cargo aircraft, often referred to by its original nickname, 'Jumbo Jet'. Its distinctive upper deck along the forward part of the aircraft has made it one of the most recognizable aircraft, and it was the first wide-body airplane produced. Manufactured by Boeing's Commercial Airplane unit in the United States, the 747 was originally envisioned to have 150 percent greater capacity than the Boeing 707, a common large commercial aircraft of the 1960s. First flown commercially in 1970, the 747 held the passenger capacity record for 37 years. \n The four-engine 747 uses a double-deck configuration for part of its length and is available in passenger, freighter and other versions. Boeing designed the 747's hump-like upper deck to serve as a first–class lounge or extra seating, and to allow the aircraft to be easily converted to a cargo carrier by removing seats and installing a front cargo door. Boeing expected supersonic airliners—the development of which was announced in the early 1960s—to render the 747 and other subsonic airliners obsolete, while the demand for subsonic cargo aircraft would remain robust well into the future. Though the 747 was expected to become obsolete after 400 were sold, it exceeded critics' expectations with production surpassing 1,000 in 1993. By January 2018, 1,543 aircraft had been built, with 11 of the 747-8 variants remaining on order. As of January 2017, the 747 has been involved in 60 hull losses, resulting in 3,722 fatalities.",
  },
  {
    title: "Boeing 757",
    subtitle: "First flight	 February 19, 1982",
    illustration: require("../../../assets/img/flight/Boe757.jpg"),
    body:
      "The Boeing 757 is a mid-size, narrow-body twin-engine jet airliner that was designed and built by Boeing Commercial Airplanes. It is the manufacturer's largest single-aisle passenger aircraft and was produced from 1981 to 2004. The twinjet has a two-crew member glass cockpit, turbofan engines of sufficient power to allow takeoffs from relatively short runways and higher altitudes, a conventional tail and, for reduced aerodynamic drag, a supercritical wing design. Intended to replace the smaller three-engine 727 on short and medium routes, the 757 can carry 200 to 295 passengers for a maximum of 3,150 to 4,100 nautical miles (5,830 to 7,590 km), depending on variant. The 757 was designed concurrently with a wide-body twinjet, the 767 and, owing to shared features, pilots can obtain a common type rating that allows them to operate both aircraft.\n The 757 was produced in two fuselage lengths. The original 757-200 entered service in 1983; the 757-200PF, a package freighter (PF) variant, and the 757-200M, a passenger-freighter combi model, debuted in the late 1980s. The stretched 757-300, the longest narrow-body twinjet ever produced, began service in 1999. Passenger 757-200s have been modified to special freighter (SF) specification for cargo use, while military derivatives include the C-32 transport, VIP carriers, and other multi-purpose aircraft. Private and government operators have also customized the 757 for research and transport roles. All 757s are powered by Rolls-Royce RB211 or Pratt & Whitney PW2000 series turbofans. \n  Eastern Air Lines and British Airways placed the 757 in commercial service in 1983. The narrow-body twinjet succeeded earlier single-aisle airliners, and became commonly used for short and mid-range domestic routes, shuttle services, and transcontinental U.S. flights. After regulators granted approval for extended flights over water (ETOPS) in 1986, airlines also began using the aircraft for intercontinental routes. Major customers for the 757 included U.S. mainline carriers, European charter airlines, and cargo companies. The airliner has recorded eight hull-loss accidents, including seven fatal crashes, as of September 2015.",
  },
  {
    title: "Boeing 767",
    subtitle: "First flight	 September 26, 1984",
    illustration: require("../../../assets/img/flight/Boe767.jpg"),
    body:
      "The Boeing 767 is a mid- to large-size, mid- to long-range, wide-body twin-engine jet airliner built by Boeing Commercial Airplanes. It was Boeing's first wide-body twinjet and its first airliner with a two-crew glass cockpit. The aircraft has two turbofan engines, a conventional tail, and, for reduced aerodynamic drag, a supercritical wing design. Designed as a smaller wide-body airliner than earlier aircraft such as the 747, the 767 has seating capacity for 181 to 375 people, and a design range of 3,850 to 6,385 nautical miles (7,130 to 11,825 km), depending on variant.",
  },
  {
    title: "Boeing 777",
    subtitle: "First flight	 June 12, 1994",
    illustration: require("../../../assets/img/flight/Boe777.jpg"),
    body:
      "The Boeing 777 is a family of long-range wide-body twin-engine jet airliners developed and manufactured by Boeing Commercial Airplanes. It is the world's largest twinjet and has a typical seating capacity of 314 to 396 passengers, with a range of 5,240 to 8,555 nautical miles (9,704 to 15,844 km). Commonly referred to as the 'Triple Seven', its distinguishing features include the largest-diameter turbofan engines of any aircraft, long raked wings, six wheels on each main landing gear, fully circular fuselage cross-section, and a blade-shaped tail cone. Developed in consultation with eight major airlines, the 777 was designed to replace older wide-body airliners and bridge the capacity difference between Boeing's 767 and 747. As Boeing's first fly-by-wire airliner, it has computer-mediated controls. It was also the first commercial aircraft to be designed entirely with computer-aided design.",
  },
  {
    title: "Boeing 787",
    subtitle: "First flight	 December 15, 2009",
    illustration: require("../../../assets/img/flight/Boe787.jpg"),
    body:
      "The Boeing 787 Dreamliner is an American long-haul, mid-size widebody, twin-engine jet airliner made by Boeing Commercial Airplanes. Its variants seat 242 to 335 passengers in typical three-class seating configurations. It is the first airliner with an airframe constructed primarily of composite materials. The 787 was designed to be 20% more fuel efficient than the Boeing 767, which it was intended to replace. The 787 Dreamliner's distinguishing features include mostly electrical flight systems, raked wingtips, and noise-reducing chevrons on its engine nacelles. It shares a common type rating with the larger Boeing 777 to allow qualified pilots to operate both models.\n    The aircraft's initial designation was the 7E7, prior to its renaming in January 2005. The first 787 was unveiled in a roll-out ceremony on July 8, 2007 at Boeing's Everett factory. Development and production of the 787 has involved a large-scale collaboration with numerous suppliers worldwide. Final assembly takes place at the Boeing Everett Factory in Everett, Washington, and at the Boeing South Carolina factory in North Charleston, South Carolina. Originally planned to enter service in May 2008, the project experienced multiple delays. The airliner's maiden flight took place on December 15, 2009, and completed flight testing in mid-2011. Boeing has reportedly spent $32 billion on the 787 program.\n     Final US Federal Aviation Administration (FAA) and European Aviation Safety Agency (EASA) type certification was received in August 2011 and the first 787-8 was delivered in September 2011. It entered commercial service on October 26, 2011 with launch customer All Nippon Airways. The stretched 787-9 variant, which is 20 feet (6.1 m) longer and can fly 450 nautical miles (830 km) farther than the -8, first flew in September 2013. Deliveries of the 787-9 began in July 2014; it entered commercial service on August 7, 2014 with All Nippon Airways, with 787-9 launch customer Air New Zealand following two days later. As of February 2018, the 787 had orders for 1,294 aircraft from 67 customers, with All Nippon Airways having the largest number on order.\n        The aircraft has suffered from several in-service problems related to its lithium-ion batteries including fires on board during commercial service. These systems were reviewed by both the FAA and the Japan Civil Aviation Bureau. The FAA issued a directive in January 2013 that grounded all 787s in the US and other civil aviation authorities followed suit. After Boeing completed tests on a revised battery design, the FAA approved the revised design and lifted the grounding in April 2013; the 787 returned to passenger service later that month.",
  },
];
