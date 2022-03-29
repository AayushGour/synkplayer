import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableNativeFeedback, ActivityIndicator } from 'react-native'
import { FILE_STORAGE_DIRECTORY, THEME_BLUE_FOREGROUND, THEME_OFF_WHITE, THEME_WHITE, TRANSPARENT_BLACK } from "./../../../Constants"
import ytsr from "react-native-ytsr";
import { playTrack } from '../player/service';
import ytdl from 'react-native-ytdl';
import Icon from "react-native-vector-icons/AntDesign";
import { connect } from 'react-redux';
import { toggleLoader } from "../../store/actions";
import * as RNFS from "react-native-fs"
import * as Animatable from "react-native-animatable";
import { addTrackToTrackRecords } from '../../utility/store/action';
import SearchItem from './SearchItem';

const styles = StyleSheet.create({
    searchContainer: {
        height: "100%",
        width: "100%",
        flex: 1
    },
    textInputContainer: {
        flexDirection: "row",
        margin: 10,
        alignItems: 'center',
        borderBottomColor: "grey",
        borderBottomWidth: 2,
    },
    textInput: {
        marginHorizontal: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: THEME_WHITE,
        flex: 1
    },
    focused: {
        borderBottomColor: THEME_BLUE_FOREGROUND,
    },
    listItemContainer: {
        width: "100%",
        borderBottomColor: THEME_OFF_WHITE,
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    listItemDetailsContainer: {
        paddingLeft: 10,
        flex: 1
    },
    listItemTitle: {
        color: THEME_WHITE,
        fontSize: 16,
        paddingBottom: 5
    },
    durationText: {
        color: THEME_WHITE,
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: TRANSPARENT_BLACK,
        padding: 5,
        borderRadius: 5
    }
})

const SearchYoutube = (props) => {
    const [search, setSearch] = useState("");
    const [focused, setFocused] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [songLoadArray, setSongLoadArray] = useState([])

    const onSubmit = async () => {
        props.toggleLoader(true);
        const filters1 = await ytsr.getFilters(search);
        const filter1 = filters1.get('Type').get('Video');
        let data = await ytsr(filter1.url)
        setSearchData(data?.items)
        props.toggleLoader(false);
    }


    return (
        <View style={styles.searchContainer}>
            <View style={[styles.textInputContainer, focused ? styles.focused : {}]}>
                <Icon name='search1' size={25} color={focused ? THEME_BLUE_FOREGROUND : "grey"} />
                <TextInput
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={styles.textInput}
                    value={search}
                    onChangeText={text => setSearch(text)}
                    blurOnSubmit={true}
                    placeholder="Search YouTube..."
                    placeholderTextColor={"grey"}
                    onSubmitEditing={onSubmit}
                />

            </View>
            <FlatList
                style={{ width: "100%" }}
                data={searchData}
                keyExtractor={(item, index) => `${item?.id}-${index}`}
                renderItem={({ item, index, separators }) => {
                    return <SearchItem item={item} />
                }}
            />
        </View>
    )
}
const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value)),
        addTrackToTrackRecords: (track) => dispatch(addTrackToTrackRecords(track))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchYoutube);