import { StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import ChatItem from '../../components/ChatItem';
import { colors, HEIGHT, WIDTH } from '../../utility';
import InputField from '../../components/InputField';
import CircleImage from '../../components/CircleImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux'
import searchSlice, { getAllUser, searchUser, setGuest } from './searchSlice';
import { allUserSelector, getAllUserStatusSelector, searchDataSelector, searchedUserListSelector, statusGetAllUserSelector } from '../../redux/selector';
let navigations;
const ItemListSearch = ({user}) => {
    const dispatch = useDispatch();
    const handlePress = () => {
        // dispath(searchSlice.actions.setGuest(user));
        dispatch(setGuest(user));
        navigations.navigate('Profile');
    }
    return (
        <ChatItem
        userName={user.userName}
        state={'Sleep'}
        lastMessage={user.email}
        timeMessage={''}
        seen= {true}
        source={user?.profileImg ? {uri: user?.profileImg} : require('../../utility/image/profileImg.png')}
        // source={{uri: user.profileImg ? user.profileImg : require('../../utility/image/profileImg.png')}}
        onPress = {() => handlePress()}
        // onPress= {()=> navigations.navigate('Profile', {user})}
        />
    )
}
const ListSearch = ({listUser}) => {
    return (
        <View>
            <FlatList
                style={ styles.listSearch }
                renderItem= {({item})=>{return <ItemListSearch user={item}/>}}
                data= {listUser}
                showsVerticalScrollIndicator= {true}
                showsHorizontalScrollIndicator= {true}
            ></FlatList>
        </View>
    )
}
const Search = ({navigation}) => {
    navigations = navigation;
    const searchData = useSelector(searchDataSelector);
    const allUser = useSelector(allUserSelector);
    const searchedUserList = useSelector(searchedUserListSelector)
    const dispath = useDispatch();
    const hanldeSearch = (e) => {
        dispath(searchSlice.actions.searchDataChage(e));
    }

    useEffect(()=>{
        dispath(getAllUser());
    },[])
    return (
    <View style={styles.container}>
        <View style={styles.containerSearch}>
            <InputField
                containerStyle={styles.searchInput}
                leftExpandedIcon={<Icon
                                name='arrow-back-ios'
                                size={30}
                                color={colors.BLACK}
                                onPress={()=> navigation.goBack()}
                                ></Icon>}
                placeholder='Seach'
                onChangeText={(e) => hanldeSearch(e)}
            ></InputField>
        </View>
        
        <View style= {{ height:1, backgroundColor:colors.GRAY_DARK}}></View>
        <ListSearch
        listUser={searchedUserList}
        ></ListSearch>
    </View>
    
  )
}

export default Search

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    containerSearch:{
        height:HEIGHT *0.1,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonBack:{
        height: HEIGHT*0.035,
        position: 'absolute',
        left:WIDTH*0.08,
        top:HEIGHT*0.033 
    },
    searchInput: {
        borderRadius: 35
    },
    listSearch: {
        paddingHorizontal: WIDTH * 0.02,
        paddingTop: HEIGHT * 0.02
    }

})