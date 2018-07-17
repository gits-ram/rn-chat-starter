import Google_Api_Key from "../../../API_KEYS";

const US_EU_MAP_CENTER = { lat: 20.5133, lon: -40.7927 };
const Sample_Path_LatLon =
  "https://maps.googleapis.com/maps/api/staticmap?center=20.5133,-40.7927&zoom=2&markers=color:red%7Clabel:SFO%7C37.7749,-122.4194&markers=color:red%7Clabel:AMS%7C52.3702,4.8952&path=color:0x0000ff50|weight:2|37.7749,-122.4194|40.7128,-74.0060|52.3702,4.8952&size=750x400&key=AIzaSyD3sTp3Xl_BJwQEfIaAmhecKVOLAnR099Y";
const Sample_Path_Encoded_Polylines =
  "https://maps.googleapis.com/maps/api/staticmap?size=600x600&path=weight:4%7Ccolor:red%7Cenc:s}gwF~eibMTBJcGDuBHqD~Auu@vBobAd@wTPyJnAgm@F}CCu@b@iTLoCVgELoBRoCFuB?eGGoF?wCKuDm@HgEt@cDf@u@Ns@A]Am@GsFiB{A_@oBUoDGs@Iq@Iu@Sq@Wo@_@uA}@qCuB{CqCsF{FwD}C_GkE}HcGYU_@e@[g@Wo@Us@Q}@ScBoA{KwAaKiBmKS}Bs@aOMmCS{@[i@OOWOo@My@GWISMQSOWq@}BYq@a@g@_@YeAc@g@[eBuBmBmBoAmAW_@QY]{@WqAOuAw@aIYyBg@cBs@{Ay@aAcAw@iAe@cF}@sAWi@Qc@WiAw@cAiAw@yAm@_B_@}AWyAUuBKmBEgC@_CFkBLoB^iDNmBDsBKqBOuAMo@c@aBkAiDm@uB]oBg@sE]uBe@kBaAcC}@wAwAkBq@o@cAs@sCkB}@{@u@cAo@mAa@eA[mAY_BOmBE{@EkGCkFGyBKsC[sEo@_Dg@aBwBaFqAeD]gAq@qCs@iDc@wAUo@_@q@{@mAeCyDcAuBqCsGo@qAWm@yE_LG[OaAQeA_A_Fi@uBk@{C{@mFIQeAqCmAwBm@cA{@}CMs@Ky@Ew@EuBDyBP}ERkB\\uBh@yB^uAj@eBZkBLqBDuBEgFCaEG_T?gFFeF@aGEyEEiBQmFe@oI_@{Ew@{Gs@yEyAyHkBoJ_CeJFQGk@SsBW{BA[?Uc@uBEu@Aw@D}@Bw@oA_@_A[UO{@_@e@OQAoBAiDAwGTw@Ba@D_A`@eAt@wCbBcBp@QFa@JW@cGjBuC`AsBl@qDhADVrApIjC[&markers=color:red%7Clabel:AAA%7C40.7282259,-73.7948332&markers=color:red%7Clabel:AAA%7C40.678183,-73.94416&key=AIzaSyD3sTp3Xl_BJwQEfIaAmhecKVOLAnR099Y";

const MAP_ZOOM = 5; //1 - world, 5-continent
const BASE_URL = "https://maps.googleapis.com/maps/api/staticmap?";
const API_KEY = Google_Api_Key;

export function staticMapStraightPath(posA, posB, size) {
  let staticMapUrl =
    BASE_URL +
    "&zoom=" +
    MAP_ZOOM +
    "&markers=color:red%7Clabel:AAA%7c" +
    posA.lat +
    "," +
    posA.lon +
    "&markers=color:red%7Clabel:BBB%7c" +
    posB.lat +
    "," +
    posB.lon +
    "&path=color:0x0000ff50|weight:2|" +
    posA.lat +
    "," +
    posA.lon +
    "|" +
    posB.lat +
    "," +
    posB.lon +
    "&size=" +
    size +
    "key=" +
    API_KEY;

  return staticMapUrl;
}

/* Get polyline from Directions API */
export function staticMapPolylineRoute(posA, posB, polyline, size) {
  console.log(JSON.stringify(posA));
  console.log(JSON.stringify(posB));
  console.log(polyline);
  //Replacing escaped backslash with a single backslash, so URL will be valid
  let encPoly = polyline.replace(/\\\\/g, "\\");

  let staticMapUrl =
    BASE_URL +
    "&markers=color:red%7Clabel:AAA%7c" +
    posA.lat +
    "," +
    posA.lon +
    "&markers=color:red%7Clabel:BBB%7c" +
    posB.lat +
    "," +
    posB.lon +
    "&path=weight:4%7Ccolor:red%7Cenc:" +
    encPoly +
    "&size=" +
    size +
    "&key=" +
    API_KEY;

  return staticMapUrl;
}
