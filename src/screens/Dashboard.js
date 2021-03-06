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
  ActivityIndicator,
  FlatList,
  Platform
} from "react-native";
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import SwitchSelector from "react-native-switch-selector";

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
Platform.OS === 'ios' ? Icon.loadFont() : '';

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

import { Colors, Images, LoginInfo, RouteParam, SearchWordData, SearchBy, PropertyTypeData } from '@constants';
import { signOut } from '../api/Firebase';
import { getContentByAction } from '../api/rest';

export default class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingType: SearchBy.listingType,
      refresh: false,
      spinner: false,
      toggleMenuVisible: false,
      categoryData: [],
      featurePropertyData: []
    }

    this.scrollRef = null;
    this.listener = this.props.navigation.addListener('focus', this.componentDidFocus.bind(this));

  }

  componentDidMount() {
    this.getCategory();
    this.getFeatureProperty();
    this.getSearchWord();
  }

  componentDidFocus() {
    SearchBy.query = '';
    SearchBy.priceTo = 100000000;
    if (this.scrollRef != null) this.scrollRef.scrollTo({ y: 0, animated: true });
    this.setState({ refresh: !this.state.refresh });
  }

  componentWillUnmount() {
    //this.listener.remove()
  }

  getCategory = () => {
    var categoryParam = {
      action: 'properties_categories',
      user_id: LoginInfo.uniqueid,
      user_account: LoginInfo.user_account,
      user_latitude: LoginInfo.latitude,
      user_longitude: LoginInfo.longitude,
      user_assigned_agent: LoginInfo.user_assigned_agent
    };

    getContentByAction(categoryParam)
      .then((res) => {
        var sortedRes = res.sort((a, b) => { return a.properties_category_displayorder - b.properties_category_displayorder })
        sortedRes.forEach((each, index) => {
          PropertyTypeData[index] = each;
        })
        this.setState({ categoryData: sortedRes });
      })
      .catch((err) => {
        //console.log('get category error', err);
      })
  }

  getFeatureProperty = () => {
    var featurePropertyParam = {
      action: 'feature_properties',
      user_latitude: LoginInfo.latitude,
      user_longitude: LoginInfo.longitude,
      user_id: LoginInfo.uniqueid,
      listingtype: SearchBy.listingType
    };
    //console.log('featurePropertyParam', featurePropertyParam);
    this.setState({ spinner: true });
    getContentByAction(featurePropertyParam)
      .then((res) => {
        //console.log('feature property', res)
        var sortedRes = res.sort((a, b) => { return a.properties_displayorder - b.properties_displayorder })
        this.setState({ featurePropertyData: sortedRes });
        this.setState({ spinner: false });
      })
      .catch((err) => {
        //console.log('get feature property error', err)
        this.setState({ spinner: false });
      })
  }

  getSearchWord = () => {
    var searchWordParam = {
      action: 'searchcities',      
      user_id: LoginInfo.uniqueid,
      user_account: LoginInfo.user_account,
      user_latitude: LoginInfo.latitude,
      user_longitude: LoginInfo.longitude,
      user_assigned_agent: LoginInfo.user_assigned_agent
    };

    getContentByAction(searchWordParam)
      .then((res) => {
        res.forEach(each => {
          if (SearchWordData.indexOf(each.search_city) == -1) SearchWordData.push(each.search_city);
        })
        this.setState({ refresh: !this.state.refresh });
      })
      .catch((err) => {
        //console.log('get searchword error', err)
      })
  }

  onCategoryPress = (categoryId, categoryName) => {    
    RouteParam.isChanged = true;
    RouteParam.searchKind = 'searchByCategory';
    SearchBy.propertyType = categoryId;
    SearchBy.categoryName = categoryName;    
    SearchBy.bedrooms = 0;
    SearchBy.bathrooms = 0;

    this.props.navigation.navigate('SearchStack');
  }

  onPropertyPress = (propertyRecordNo) => {
    RouteParam.propertyRecordNo = propertyRecordNo;
    this.props.navigation.navigate('PropertyStack');
  }

  onToggleMenu = () => {
    this.setState({ toggleMenuVisible: !this.state.toggleMenuVisible });
  }

  onLogout = () => {
    signOut();
    
    this.setState({ toggleMenuVisible: !this.state.toggleMenuVisible });

    AsyncStorage.removeItem('LoginInfo');
    this.props.navigation.navigate('Auth', {screen: 'SocialLogin'});
  }

  onSearch = (query) => {
    RouteParam.searchKind = 'searchByQuery';
    SearchBy.query = query;    
    
    SearchBy.listingType = SearchBy.propertyType == 6 ? 'R' : 'S';
    if (query) {
      RouteParam.isChanged = true;
      this.props.navigation.navigate('SearchStack');
    }
  }

  onTouchEvent = (e) => {
    var locationX = e.nativeEvent.locationX;
    if (this.state.toggleMenuVisible && locationX > width * 0.8) {
      this.setState({ toggleMenuVisible: false });
    }
  }

  render() {
    return (
      <View style={styles.container} onTouchStart={(e) => this.onTouchEvent(e)}>
        {this.state.toggleMenuVisible ?
          <SideMenu navigation={this.props.navigation} onToggleMenu={this.onToggleMenu} onLogout={this.onLogout} />
          : null
        }
        <ScrollView
          ref={ref => this.scrollRef = ref}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground style={styles.backImgContainer} source={require('../assets/images/dashboardBackground.png')}>
            <View style={styles.sideMenuIcon}>
              <TouchableOpacity onPress={() => this.setState({ toggleMenuVisible: !this.state.toggleMenuVisible })}>
                <Icon
                  name='bars'
                  size={30}
                  color='white'
                />
              </TouchableOpacity>
            </View>
            <View style={styles.searchBoxContainer}>
              <SearchBox boxStyle={{ width: width * 0.9, height: normalize(40, 'height'), backgroundColor: Colors.whiteColor, borderColor: Colors.blueColor, btnColor: Colors.blueColor }} onSearch={(query) => this.onSearch(query)} />
            </View>
          </ImageBackground>

          <View style={styles.contentContainer}>
            <View style={styles.switchBoxContainer}>
              <SwitchSelector
                initial={SearchBy.listingType == 'S' ? 0 : 1}
                onPress={value => {
                  this.setState({ listingType: value, featurePropertyData: [] });
                  SearchBy.listingType = value;
                  this.getFeatureProperty();
                }}
                backgroundColor='#E2E6EC'
                height={50}
                textColor={Colors.blackColor}
                selectedColor={Colors.blueColor}
                buttonColor='white'
                options={[
                  { label: "BUY", value: "S" },
                  { label: "RENT", value: "R" }
                ]}
              />
            </View>

            <View style={styles.browseContainer}>
              <View style={styles.browseTxtContainer}>
                <Text style={{ fontFamily: 'SFProText-Semibold', fontSize: 12, color: Colors.blackColor }}>BROWSE BY</Text>
              </View>
              <View style={styles.browseImgContainer}>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.categoryData}
                  renderItem={({ item, index }) => <BrowseCard item={item} onPress={() => this.onCategoryPress(item.properties_category_id, item.properties_category_short_desc)} />}
                  keyExtractor={item => item.properties_category_id}
                />
              </View>
            </View>

            <View style={styles.featureContainer}>
              <View style={styles.featureTxtContainer}>
                <Text style={{ fontFamily: 'SFProText-Semibold', fontSize: 12, color: Colors.blackColor }}>FEATURE PROPERTIES NEAR YOU</Text>
              </View>
              <View style={styles.featureImgContainer}>
                <ActivityIndicator style={{ position: 'absolute' }} animating={this.state.spinner} />
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={this.state.featurePropertyData}
                  renderItem={({ item }) => <PropertyCard cardStyle={{ width: normalize(325), height: normalize(245, 'height'), marginTop: 0, marginRight: normalize(10) }} item={item} onPress={() => this.onPropertyPress(item.property_recordno)} />}
                  keyExtractor={item => item.property_recordno}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
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
    height: height
  },
  backImgContainer: {
    width: width,
    height: height,
    //borderWidth: 2
  },
  sideMenuIcon: {
    width: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(25, 'height'),
    marginLeft: normalize(20)
  },
  searchBoxContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: normalize(25, 'height'),
  },
  contentContainer: {
    //backgroundColor: '#e0e0e0',
    width: width,
    marginTop: normalize(-210, 'height'),
  },
  switchBoxContainer: {
    width: '70%',
    height: normalize(40, 'height'),
    alignSelf: 'center',
    //marginTop: normalize(315, 'height'),
    //borderWidth: 2
  },
  browseContainer: {
    width: '95%',
    height: normalize(156, 'height'),
    alignSelf: 'center',
    marginTop: normalize(25, 'height'),
    //borderWidth: 2
  },
  browseTxtContainer:{
    height: '15%',
    justifyContent: 'center',
    paddingLeft: 5,
    //borderWidth: 1
  },
  browseImgContainer: {
    height: '90%'
  },
  featureContainer: {
    width: '95%',
    height: normalize(280, 'height'),
    alignSelf: 'center',
    //marginTop: normalize(10, 'height'),
    //borderWidth: 2
  },
  featureTxtContainer: {
    height: '10%',
    justifyContent: 'center',
    paddingLeft: 5,
    //borderWidth: 1
  },
  featureImgContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
});