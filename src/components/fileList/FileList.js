import React, { useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableNativeFeedback, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { defaultStyles, THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { playTrack, playTrackWithIndex } from '../player/service';
import { getFiles, setIntervalTimeout, toggleDirectoryReadPath } from '../../utility/store/action';
import * as RNFS from "react-native-fs";
import { toggleLoader } from '../../store/actions';
import Icon from "react-native-vector-icons/AntDesign";

const styles = StyleSheet.create({
    fileListContainer: {
        height: "100%",
        width: "100%",
    },
    listItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: THEME_WHITE,
        marginHorizontal: 5
    },
    listElem: {
        color: THEME_WHITE,
        width: "100%",
        marginLeft: 8
    }
})

const FileList = (props) => {
    useEffect(() => {
        if (props?.isFocused) {
            refreshList();
        }
    }, [props.directoryReadPath])


    const refreshList = () => {
        props.toggleLoader(true);
        getFiles(props.directoryReadPath)
    }

    return (
        <View style={styles.fileListContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 10 }}>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ color: THEME_WHITE, fontSize: 15, paddingRight: 5 }}>{props.directoryReadPath}</Text>
                    <Icon.Button
                        name='swap'
                        style={defaultStyles.iconButtonStyle}
                        color={THEME_WHITE}
                        backgroundColor="transparent"
                        size={24}
                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                        onPress={() => { props.toggleDirectoryReadPath() }}
                    />

                </View>
                <Icon.Button
                    name='reload1'
                    style={defaultStyles.iconButtonStyle}
                    color={THEME_WHITE}
                    backgroundColor="transparent"
                    size={20}
                    background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                    onPress={() => { refreshList() }}
                />
            </View>

            {
                props.allFiles?.length > 0 ?
                    <FlatList
                        style={{ width: "100%" }}
                        keyExtractor={(item, index) => `${index}-${item.uri}`}
                        data={props.allFiles}
                        renderItem={({ item, index, separators }) => {
                            return <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                                onPress={() => {
                                    playTrackWithIndex(index)
                                }}
                            // onLongPress={() => {
                            //     this.setState({
                            //         selectFile: true
                            //     })
                            // }}
                            >
                                <View style={styles.listItemContainer}>
                                    {/* {this.state.selectFile && <CheckBox  
                                />} */}
                                    <SimpleIcon name="music-tone-alt" size={20} color="#fff" />
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.listElem}>{item.title}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        }}
                    /> :
                    <View style={{ width: "100%", height: "100%", justifyContent: "center" }}>
                        <Text style={{ color: THEME_WHITE, alignSelf: "center" }}>No data available</Text>
                    </View>
            }

        </View >
    )
}

const mapStateToProps = (state) => {
    return {
        displayLoader: state.app.displayLoader,
        allFiles: state.data.allFiles,
        directoryReadPath: state.data.directoryReadPath
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value)),
        toggleDirectoryReadPath: () => dispatch(toggleDirectoryReadPath())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)