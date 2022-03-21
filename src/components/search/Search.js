import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableNativeFeedback } from 'react-native'
import { THEME_BLUE_FOREGROUND, THEME_OFF_WHITE, THEME_WHITE } from "./../../../Constants"
import ytsr from "react-native-ytsr";

const styles = StyleSheet.create({
    searchContainer: {
        height: "100%",
        width: "100%",
        flex: 1
    },
    textInput: {
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        paddingVertical: 5,
        color: THEME_WHITE
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
    }
})

const SearchYoutube = (props) => {
    const [search, setSearch] = useState("");
    const [focused, setFocused] = useState(false);
    const [searchData, setSearchData] = useState([])

    const onSubmit = async () => {
        const filters1 = await ytsr.getFilters(search);
        const filter1 = filters1.get('Type').get('Video');
        let data = await ytsr(filter1.url)
        setSearchData(data?.items)
    }

    const handleClick = (item) => {
        let videoItem = {
            url: item?.url,
            title: item?.title,
            artist: item?.author?.name,
            artwork: item?.bestThumbnail?.url
        }
        console.log(videoItem)
    }

    return (
        <View style={styles.searchContainer}>
            <TextInput
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={[styles.textInput, focused ? styles.focused : {}]}
                value={search}
                onChangeText={text => setSearch(text)}
                blurOnSubmit={true}
                placeholder="Search YouTube..."
                placeholderTextColor={"grey"}
                onSubmitEditing={onSubmit}
            />
            <FlatList
                style={{ width: "100%" }}
                data={searchData}
                keyExtractor={(item, index) => `${item?.id}-${index}`}
                renderItem={({ item, index, separators }) => {
                    return <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                        onPress={() => handleClick(item)}
                    >
                        <View style={styles.listItemContainer}>
                            <Image style={{ aspectRatio: 16 / 9, height: 70 }} source={{ uri: item?.bestThumbnail?.url }} />
                            <View style={styles.listItemDetailsContainer}>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.listItemTitle}>{item?.title}</Text>
                                <Text style={{ color: THEME_WHITE }}>{item?.duration}</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                }}
            />
        </View>
    )
}

export default SearchYoutube