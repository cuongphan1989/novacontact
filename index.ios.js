/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  AsyncStorage,
  ActivityIndicator,
  NetInfo,
  FlatList,
  AppState  
} from 'react-native';

import Communications from 'react-native-communications';
import store from 'react-native-simple-store';
import Toast from 'react-native-simple-toast';
//import Toast from 'react-native-root-toast';

import {
  IndicatorViewPager,
  PagerTabIndicator
} from 'rn-viewpager'

const url = "http://192.168.1.107:8008";

class DemoViewPager extends Component {

  constructor(props){
    super(props);
    //this._onShowContactDetail = this._onShowContactDetail.bind(this);

    dulieu = [];
    //ds = new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 !== r2});

    this.state = {
      appState: AppState.currentState,
      dataSource: [],
      dataSourceF: [],      
      contact: {
        Code: "",
        Name: "",
        Email: "",
        OneContact: "",
        Department: "",
        JobTitle: ""
      },
      isVisible: false,
      userName: "",
      password: "",
      isLogin: true,
      isUpdate: false,
      wait: ""
    };


  //   let toast = Toast.show('This is a message', {
  //     duration: Toast.durations.LONG,
  //     position: Toast.positions.BOTTOM,
  //     shadow: true,
  //     animation: true,
  //     hideOnPress: true,
  //     delay: 0
  // });
  };

  _changeFavorite(id){

    for(let i = 0; i < dulieu.length; i++){
      if(dulieu[i].Id == id) {
        if (dulieu[i].Favorite == 0) {
          dulieu[i].Favorite = 1;
        }
        else {
          dulieu[i].Favorite = 0;
        }
        break;
      }
    }

    AsyncStorage.setItem("Nhanvien", JSON.stringify(dulieu));
    
    this.setState({dataSource: dulieu});    
    this.setState({dataSourceF: dulieu.filter(item => item.Favorite == 1)});
    
  };


  _renderRow(data){
    return(

      <View style={styles.rowContent}>
        <TouchableOpacity style={{flex: 4}} onPress={() => Communications.phonecall( '100' + data.OneContact, false)}>
          <Image style={styles.imageRow} source={require('./images/phone.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 13}} onPress={this._onShowContactDetail.bind(this, data)}>
          <View  style={styles.contentContainer}>
            <Text style={styles.title}>{data.Name}</Text>
            <Text style={styles.content}>{data.Department} ({data.OneContact})</Text>
          </View>
        </TouchableOpacity>          
        <TouchableOpacity style={{flex: 3}} onPress={this._changeFavorite.bind(this, data.Id)}>
          <Image style={styles.imageFavorite} source={ data.Favorite == 0 ? require('./images/unfavorite2.png') : require('./images/favorite2.png')}/>
        </TouchableOpacity>
      </View>
    )
  };

  _renderSeparator(sectionID, rowID, rowSelected){
    return(
      <View style={{height: 1, backgroundColor: '#ccc'}}>

      </View>
    )
  };


  _onChangeText(f, value){
      //alert(value);
      if (f == 0) {
        let data = dulieu.filter((item)=>{
          if (item.Name.indexOf(value) > -1 || item.UnsignName.indexOf(value) > -1 || item.Email.indexOf(value) > -1 || item.OneContact.indexOf(value) > -1) {
            return item;
          }
        });
  
        this.setState({
          dataSource: data
        });
      }
      else {
        let data = dulieu.filter((item)=>{
          if (item.Favorite == 1 && (item.Name.indexOf(value) > -1 || item.UnsignName.indexOf(value) > -1 || item.Email.indexOf(value) > -1 || item.OneContact.indexOf(value) > -1)) {
            return item;
          }
        });
  
        this.setState({
          dataSourceF: data
        });
      }


  };

  _onUpdateContact(){
    this.setState({ isUpdate: true });
    AsyncStorage.getItem('token').then((token) => {
    //NetInfo.isConnected.fetch().then((isConnected) => {
      //if(isConnected == true){
        this._checkStatusToken(url + '/api/values', token, 2000)
        //fetch('http://192.168.1.112:9999/api/values')
        .then((value)=>value.json())
        .then((value)=>{
          this.setState({ isUpdate: false });

          Toast.show("Cập nhật thành công!!!", Toast.LONG);
          
          dulieu = value;

          for(let j = 0; j < this.state.dataSourceF.length; j ++){

            // dulieu.forEach(function(element) {
            //   if(element.Id == this.state.dataSourceF[j].Id) {
            //     element.Favorite = 1;
            //     //break;
            //   }
              
            // }, this);

            for (let k = 0; k < dulieu.length; k++)
            {
              if (dulieu[k].Id == this.state.dataSourceF[j].Id)
              {
                dulieu[k].Favorite = 1;
                break;
              }
            }

            // let idx = dulieu.filter(item => item.Id == this.state.dataSourceF[j].Id);
            // let abc = dulieu.indexOf(idx);
            // alert(abc);
            // if(idx > -1)
            // {
            //   dulieu[idx].Favorite = 1;
            // }
          }

          AsyncStorage.setItem("Nhanvien", JSON.stringify(dulieu));

          this.setState({dataSource: dulieu});
        })
        .catch(error => {
          this.setState({ isUpdate: false });
          alert("Kết nối server thất bại!!!")
        })
        .done();
      // }
      // else {
      //   this.setState({ isUpdate: false });
      //   alert("Vui lòng kết nối internet");
      // }
    //}).done();
    }).catch(e => alert(e)).done();

  };


  _renderTab(){
      tabs = [
       
        {
          text: '',
          iconSource: require('./images/user.png'),
          selectedIconSource: require('./images/user.png')
        },
        {
          text: '',
          iconSource: require('./images/heart.png'),
          selectedIconSource: require('./images/heart.png')
        },
        {
          text: '',
          iconSource: require('./images/dial.png'),
          selectedIconSource: require('./images/dial.png')
        }
      ];

      return(
        <PagerTabIndicator style={{position: 'absolute'}} tabs={tabs}/>
      )
  };

  _renderTab1(){

    if(this.state.isUpdate == false){
      return(
        <View style={{paddingTop: 60, flex: 1, marginRight: 5}}>
          <View style={{ flex: 3 }}>
          </View>
          <TouchableOpacity onPress={this._onUpdateContact.bind(this)} style={{flex: 2, justifyContent: 'center', alignItems: 'center',}}>
            <Text style={styles.textTab1} >Cập nhật</Text>
          </TouchableOpacity>
          <View style={{ flex: 3 }}>
          </View>
          <View style={{flex: 2, justifyContent: 'center', alignItems: 'center',}}>
            <Text style={styles.infoTab1}>Phiên bản: 1.0.0</Text>
            <Text style={styles.infoTab1}>Phát triển bởi Phan Quốc Cường - Phòng IT</Text>
            <Text style={styles.infoTab1}>One Contact: 2745</Text>
            <Text style={styles.infoTab1}>Email: cuong.phanquoc@novaland.com.vn</Text>
          </View>
  
         
        </View>
      )
    }
    else {
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator
            animating={this.state.isUpdate}
            color={'#343434'}
            size={75}
        />
        </View>
      )
    }


  };

  _renderTab2(){
    return(
      <View style={{paddingTop: 55, flex: 1}}>
        <TextInput onChangeText={this._onChangeText.bind(this, 0)} placeholder={"Nhập nội dung cần tìm... "}/>
        {/* <ListView
          enableEmptySections={true}
          pageSize={dulieu.length}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator.bind(this)}
          //contentContainerStyle={{flexDirection: 'row', flexWrap:'wrap', justifyContent: 'center', alignItems: 'center'}}
        /> */}
        <FlatList 
                    data={this.state.dataSource}
                    renderItem={({item}) => this._renderRow(item) }
                    ItemSeparatorComponent={this._renderSeparator.bind(this)}
                    keyExtractor={item => item.Id}
                />
      </View>
    )
  };


  _renderTab3(){
    return(
      <View style={{paddingTop: 55, flex: 1}}>
        <TextInput onChangeText={this._onChangeText.bind(this, 1)} placeholder={"Nhập nội dung cần tìm... "}/>

        <FlatList 
                    data={this.state.dataSourceF}
                    renderItem={({item}) => this._renderRow(item) }
                    ItemSeparatorComponent={this._renderSeparator.bind(this)}
                    keyExtractor={item => item.Id}
                />
      </View>
    )
  };

  _onShowContactDetail(data){
    //lert(data.FullName);
    this.setState({
      contact: {
        Code: data.Code,
        Name: data.Name,
        Email: data.Email,
        OneContact: data.OneContact,
        Department: data.Department,
        JobTitle: data.JobTitle
      },
      isVisible: true
    });
  };

  _onLogin(){
    let Email = this.state.userName;
    let Password = this.state.password;

    if (Email == "" || Password == ""){
      alert("Vui lòng nhập đủ thông tin!!!");
      return;
    }
    this.setState({ wait: "Vui lòng chờ!!!" });
    this._checkStatus(url + '/api/values?Username=' + Email + "&Password=" + Password, 2000)
    //fetch('http://192.168.1.112:9999/api/values?Username=' + Email + "&Password=" + Password)
    .then((value)=>value.json())
    .then((value)=>{
      //alert(value);
      this.setState({ wait: "" });
      if(parseInt(value) == 0){
        alert("Thông tin đăng nhập không đúng!!!");
      }
      else {
        AsyncStorage.setItem('token', value);
        // store.update('account', {
        //   userName: this.state.userName,
        //   password: this.state.password
        // })
        this._getData(value);        
        this.setState({isLogin: false});
        //alert("Đã gửi mật khẩu qua email của bạn!!!");
      }
    })
    .catch(error => alert("Không thể kết nối đến server"))
    .done();
  };

  _onGetPassword(){
    let Email = this.state.userName;
    //alert(Email);
    if (Email == ""){
      alert("Vui lòng nhập tên đăng nhập!!!");
      return;
    }
    this.setState({ wait: "Vui lòng chờ!!!" });
    this._checkStatus(url + '/api/values?Email=' + Email + "&Type=1", 10000)
    //fetch('http://192.168.1.112:9999/api/values?Email=' + Email + "&Type=1")
    .then((value)=>value.json())
    .then((value)=>{
      this.setState({ wait: "" });
      //alert(value);
      if(parseInt(value) == 0){
        alert("Tài khoản không tồn tại!!!");
      }
      else {
        alert("Đã gửi mật khẩu qua email của bạn!!!");
      }
    })
    .catch(error => alert("Không thể kết nối đến server"))
    .done();
  };

  _onAddContact(contact){
    //alert(contact.Name);
    var Contacts = require('react-native-contacts');

    
    var newPerson = {
      company: "Novaland",
      emailAddresses: [{
        label: "work",
        email: contact.Email,
      }],
      familyName: contact.Name,
      //givenName: "Friedrich",
      jobTitle: contact.JobTitle,
      //middleName: "",
      phoneNumbers: [{
        label: "mobile",
        number: "100" + contact.OneContact,
      }],
    }
     
    Contacts.addContact(newPerson, (err) => {
      Contacts.getAll((err, contacts) => {
        if(err === 'denied'){
          // error
          alert("Có lỗi xảy ra");
        } else {
          // contacts returned in []
          alert("Thêm thành công");
        }
      })
      
     });

    
  };

  _checkStatus(url, timeout) {
    return new Promise(function(resolve,reject) {
      fetch(url)
      .then((data)=>{ resolve(data) })
      .catch((e)=>{ reject(e) })
      
      setTimeout(()=>{
        //callback()
        reject()
      },timeout)
    })
  };


  _checkStatusToken(url, token, timeout) {
    return new Promise(function(resolve,reject) {
      fetch(url, {
        method: 'GET',
        headers: {
          'token': token,
        }
      })
      .then((data)=>{ resolve(data) })
      .catch((e)=>{ reject(e) })
      
      setTimeout(()=>{
        //callback()
        reject()
      },timeout)
    })
  };

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      //alert('App has come to the foreground!');
      this._checkUser();
    }
    this.setState({appState: nextAppState});
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);
    // Get updated object
    //store.get('account')
    this._checkUser();
    //alert(dataListView);
  };

  _checkUser(){
    AsyncStorage.getItem('token')
    .then((res) => {
      if (res != undefined && res != null) {
        //alert(res.userName + " - " + res.password); // 'Blurry Face'
        //let Email = res.userName;
        //let Password = res.password;
        
        this._checkStatusToken(url + '/api/values?a=a&b=b&c=c', res, 3000)
        //fetch('http://192.168.1.112:9999/api/values?Username=' + Email + "&Password=" + Password)
        .then((value)=>value.json())
        .then((value)=>{
          //alert(value);
          if(parseInt(value) == 0) {
            //alert("Thông tin đăng nhập không đúng!!!");
            AsyncStorage.removeItem('Nhanvien').then().done();
            AsyncStorage.removeItem('token').then().done();
            dulieu = [];
            this.setState({isLogin: true});
            this.setState({dataSource: dulieu});
            this.setState({dataSourceF: dulieu});
          }
          else {   
            
            this._fillData();
            //AsyncStorage.setItem('token', value);
            //this._getData(value);
            //alert(value);
          }
        })
        .catch(error => {
          //alert("fuck");
          this._fillData();
        })
        .done();
      }
    })
    .done();
  };

  _fillData(){
    AsyncStorage.getItem('Nhanvien').then((value) => JSON.parse(value)).then((value) => {
      if (value != null && value.length > 0) {
        dulieu = value;
        this.setState({isLogin: false});
        this.setState({dataSource: value});
        this.setState({dataSourceF: value.filter(item => item.Favorite == 1)});
      }
    }).catch(e => alert(e)).done();  };

  _getData(token){
    AsyncStorage.getItem('Nhanvien').
    then((value)=> JSON.parse(value)).
    then((value)=> {
      if(value == null || value.length == 0) {
        this._checkStatusToken(url +  '/api/values', token, 2000)
        //fetch('http://192.168.1.107:9999/api/values')
        .then((value)=>value.json())
        .then((value)=>{
          //alert(value);
          dulieu = value;
            
          AsyncStorage.setItem("Nhanvien", JSON.stringify(dulieu));

          this.setState({dataSource: dulieu});
          this.setState({dataSourceF: dulieu.filter(item => item.Favorite == 1)});
        })
        .done();
      }
      else {
        dulieu = value;
        this.setState({dataSource: dulieu});
        this.setState({dataSourceF: dulieu.filter(item => item.Favorite == 1)});
        
      }
    }).done();
  };

  _renderView(){

      return(
        <IndicatorViewPager style={{flex: 1}}
          indicator={this._renderTab()}
        >
          
          {this._renderTab2()}
          {this._renderTab3()}
          {this._renderTab1()}
        </IndicatorViewPager>
      );
    
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menuBar}><Text style={styles.menuBarText}>NOVA CONTACT</Text></View>
        
        {this._renderView()}
        <Modal onRequestClose={() => {alert("Modal has been closed.")}} animationType={'fade'} transparent={true} visible={this.state.isVisible}>
        <TouchableOpacity onPress={()=> this.setState({isVisible: false})}>
          <Image style={styles.imageBack} source={require('./images/back.png')}/>
        </TouchableOpacity>
          {/* <Text onPress={()=> this.setState({isVisible: false})} style={styles.menuBar}>Trở về</Text> */}
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 1, marginLeft: 10}}>
                <Image style={styles.imageIcon} source={require('./images/code.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.Code}</Text>
                <Image style={styles.imageIcon} source={require('./images/name.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.Name}</Text>
                <Image style={styles.imageIcon} source={require('./images/onecontact.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.OneContact}</Text>
                <Image style={styles.imageIcon} source={require('./images/email.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.Email}</Text>
                <Image style={styles.imageIcon} source={require('./images/department.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.Department}</Text>
                <Image style={styles.imageIcon} source={require('./images/position.png')}/>
                <Text style={{fontSize: 17}}>{this.state.contact.JobTitle}</Text>
                
                <TouchableOpacity onPress={this._onAddContact.bind(this, this.state.contact)} style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                  <Text style={styles.textTab1}>Thêm vào danh bạ</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal> 



        <Modal onRequestClose={() => {alert("Modal has been closed.")}} animationType={'fade'} transparent={true} visible={this.state.isLogin}>
          {/* <Text onPress={()=> this.setState({isVisible: false})} style={styles.menuBar}>Trở về</Text> */}
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Image style={{resizeMode: 'contain'}} source={require('./images/logo_novaland.png')}/>
            </View>
            <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>                
                
                <TextInput style={{width: 300, fontSize: 18}} onChangeText={(value)=> this.setState({userName: value})} ref="txtEmail" placeholder={"Email"} />
                <TextInput style={{width: 300, marginTop: 15, fontSize: 18}} onChangeText={(value)=> this.setState({password: value})} ref="txtPassword" placeholder={"Password"} />
                <Text style={{width: 300, marginTop: 30, color: 'red', fontSize: 18}} >{ this.state.wait} </Text>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity onPress={this._onLogin.bind(this)}>
                    <Text style={styles.btnLogin} >Đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity >
                    <Text style={styles.btnGetPassword} >Thoát</Text> 
                  </TouchableOpacity>
                </View>
                               
            </View>
          </View>
        </Modal> 

      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  menuBar: {
    backgroundColor: '#354772',
    height: 55,

    justifyContent: 'center',
    alignItems: 'center',

  },

  menuBarText: {
    color: 'white',
    fontSize: 18
  },

  textTab1: {
    color: 'white',
    backgroundColor: '#354772',
    padding: 15,
    
  },

  btnLogin: {
    color: 'white',
    backgroundColor: '#354772',
    padding: 10,
    
  },

  btnGetPassword: {
    marginLeft: 10,
    color: 'white',
    backgroundColor: '#354772',
    padding: 10,
    
  },

  infoTab1: {
   
    fontStyle: 'italic'
  },

  contentContainer: {  
    margin: 5
  },

  rowContent: {
    flex: 1,
    minHeight: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  title: {
    color: 'black',
    flex: 1,
    fontSize: 18,
    fontWeight: '800'
  },

  content: {
    flex: 3,
    fontStyle: 'italic'
  },

  imageRow: {
    marginLeft: 10,
    width: 55,
    height: 50
  },

  imageFavorite: {
    marginBottom: 8,
    width: 35,
    height: 30
  },

  imageIcon: {
    width: 35,
    height: 35,
    marginTop: 10
  },

  box: {
    width: 100,
    height: 100,
    backgroundColor: 'aqua',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },

  imageBack: {
    marginLeft: 10,
    marginTop: 15,
    marginBottom: 15,
    width: 25,
    height: 20
  }
});

AppRegistry.registerComponent('DemoViewPager', () => DemoViewPager);
