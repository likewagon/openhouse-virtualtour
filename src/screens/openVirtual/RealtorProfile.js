import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  FlatList
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import {
  BrowseCard,
  Button,
  CallCard,
  Header,
  LabelTag,
  PropertyCard,
  SearchBox,
  SideMenu,
  SignModal,
} from '@components';
import { Colors, Images, RouteParam } from '@constants';

export default class RealtorProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      propertiesByMeData: [],
    }
  }

  componentDidMount() {

  }

  onPropertyPress = () => { }

  render() {
    const btnBlueStyle = { width: width * 0.45, height: 50, color: 'blue' };
    const btnWhiteStyle = { width: width * 0.45, height: 50, color: 'white' };
    return (
      <ImageBackground style={styles.container}>
        <View style={{ width: '100%' }}>
          <Header title='PROFILE' titleColor={Colors.blackColor} onPressBack={() => this.props.navigation.goBack(null)} />
        </View>
        <View style={styles.body}>
          <View style={styles.imgAndNameContainer}>
            <View style={styles.imgContainer}>
              <Image style={{ width: '100%', height: '100%', borderRadius: 10 }} source={{ uri: RouteParam.agent.img }} resizeMode='stretch' />
            </View>
            <View style={styles.nameContainer}>
              <View style={{ width: '100%', height: '20%', justifyContent: 'center' }}><Text style={{ fontFamily: 'SFProText-Bold', fontSize: RFPercentage(2.2), color: Colors.blackColor }}>{RouteParam.agent.fullname}</Text></View>
              <View style={{ width: '100%', height: '20%', justifyContent: 'center' }}><Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(1.8), color: Colors.passiveTxtColor }}>{RouteParam.agent.title}</Text></View>              
            </View>
          </View>

          <View style={styles.btnsContainer}>
            <View style={styles.callBtnContainer}>
              <Button btnTxt='Call' btnStyle={{ width: width * 0.66, height: normalize(50, 'height'), color: 'blue' }} onPress={() => {}} />
            </View>
            <View style={styles.msgBtnContainer}>
              <TouchableOpacity style={{ width: normalize(55), height: normalize(55) }} onPress={() => {}}>
                <Image style={{ width: '100%', height: '100%' }} source={Images.btnMsg} resizeMode='contain' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.listingContainer}>
            {/* <TouchableOpacity style={styles.activeContainer} onPress={() => this.props.navigation.navigate('MyListing', { tab: 'active' })}> */}
            <View style={styles.activeContainer}>
              <View style={{ width: '90%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SFProText-Semibold', fontSize: RFPercentage(2.2), color: Colors.blackColor }}>ACTIVE LISTINGS</Text>
              </View>
              <View style={{ width: '90%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(3.2), color: Colors.blackColor }}>{RouteParam.agent.activeListing}</Text>
              </View>
            </View>
            {/* </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.soldContainer} onPress={() => this.props.navigation.navigate('MyListing', { tab: 'sold-rented' })}> */}
            <View style={styles.soldContainer}>
              <View style={{ width: '90%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SFProText-Semibold', fontSize: RFPercentage(2.2), color: Colors.blackColor }}>SOLD</Text>
              </View>
              <View style={{ width: '90%', height: '30%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SFProText-Regular', fontSize: RFPercentage(3.2), color: Colors.blackColor }}>{RouteParam.agent.sold}</Text>
              </View>
            </View>
            {/* </TouchableOpacity> */}
          </View>

          <View style={styles.listTitleContainer}>
            <Text style={{ fontFamily: 'SFProText-Semibold', fontSize: RFPercentage(2), color: Colors.blackColor }}>PROPERTIES LISTED BY ME</Text>
          </View>
          <View style={styles.listContainer}>
            {(this.state.propertiesByMeData.length == 0) ?
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 14 }}>No Properties</Text>
              </View>
              :
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.propertiesByMeData}
                renderItem={({ item }) => <PropertyCard cardStyle={{ width: normalize(325), height: normalize(245, 'height'), marginRight: normalize(10) }} item={item} onPress={this.onPropertyPress} />}
                keyExtractor={item => item.id}
              />
            }
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flex: 1,
    width: width,
    height: height,
  },
  body: {
    width: wp(100),
    height: hp(100),
    marginTop: normalize(20, 'height'),
    borderColor: Colors.borderColor,
    borderTopWidth: normalize(0.5, 'height'),
  },
  btnContainer: {
    width: '95%',
    height: normalize(60),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(20, 'height'),
    //borderWidth: 1
  },
  imgAndNameContainer: {
    width: '95%',
    height: '16%',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: normalize(5),
    paddingLeft: normalize(15),
    //borderWidth: 1
  },
  imgContainer: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: 8,
    //borderWidth: 1
  },
  nameContainer: {
    width: '65%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: normalize(15),
    //borderWidth: 1
  },
  btnsContainer: {
    width: '95%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  callBtnContainer: {
    width: '75%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignSelf: 'center',
    paddingRight: normalize(6),
    //borderWidth: 1
  },
  msgBtnContainer: {
    width: '25%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  listingContainer: {
    width: '95%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  activeContainer: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  soldContainer: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth: 1
  },
  listTitleContainer: {
    width: '95%',
    height: normalize(30, 'height'),
    justifyContent: 'center',
    alignSelf: 'center',
    paddingLeft: 10,
    marginTop: normalize(10, 'height'),
    //borderWidth: 1
  },
  listContainer: {
    width: '95%',
    height: '40%',
    justifyContent: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
  emptyContainer: {
    width: '60%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    //borderWidth: 1
  },
});