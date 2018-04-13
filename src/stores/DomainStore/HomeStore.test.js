import HomeStore from "./HomeStore";
import menuItem from "../../container/HomeContainer/menuItems.json";

describe("HomeStore", () => {
  it("should handle FETCH_LIST_SUCCESS", () => {
    const store = new HomeStore();
    store.fetchItems(menuItem);
    const expectedArray = [
      "Infinite People Flatlist With Search",
      "Sticky LargeList-Grid (Ext Lib)",
      "Chat UI",
      "AutoComplete/TypeAhead",
      "ScrollView with Animated/Collapsible Header",
      "FlatList with Animated/Collapsible Header",
      "Calendar View (TBD)",
    ];
    var actualJSON = JSON.stringify(store.items);
    var expectedJSON = JSON.stringify(expectedArray);
    expect(expectedJSON).toEqual(actualJSON);
  });
});
