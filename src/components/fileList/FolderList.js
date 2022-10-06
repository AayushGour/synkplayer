import React, { Component, useCallback, useEffect, useState } from 'react';
import { Button, DeviceEventEmitter, FlatList, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import * as RNFS from 'react-native-fs';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { ADD_TO_PLAYLIST_MENU_ITEM, defaultStyles, fileExtenstionList, SELECT_ALL_MENU_ITEM, TEXT_DISABLED, THEME_BLUE_FOREGROUND, THEME_BLUE_FOREGROUND_TRANSPARENT, THEME_WHITE } from '../../../Constants';
import CheckBox from '@react-native-community/checkbox';
import { playTrackWithPath } from '../player/service';
import { connect } from 'react-redux';
import { setSelectedFiles, setSelectFile } from '../../store/actions';
import AntDIcon from "react-native-vector-icons/AntDesign";
import { toggleDirectoryReadPath } from '../../utility/store/action';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';


const styles = StyleSheet.create({
    fileListContainer: {
        width: "100%",
        flex: 1
    },
    backButton: {
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        paddingLeft: 10,
        paddingRight: 2,
    },
    currentPathLabelContainer: {
        // paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    currentPathLabel: {
        color: THEME_WHITE,
        marginLeft: 10,
        flex: 1,
        width: "80%",
    },
    selectedFileCount: {
        color: THEME_WHITE,
        marginRight: 10,
        fontSize: 14
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
    },
    disabled: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: THEME_WHITE,
        marginHorizontal: 5,
    },
    disabledText: {
        color: TEXT_DISABLED,
        width: "100%",
        marginLeft: 8

    },
    selected: {
        backgroundColor: THEME_BLUE_FOREGROUND_TRANSPARENT
    }
})

const FolderList = (props) => {
    const [fileList, setFileList] = useState([]);
    const [currentPath, setCurrentPath] = useState(props.directoryReadPath);


    const getSelectedFiles = (array) => {
        let fileListData = fileList?.filter((element, index) => array?.includes(index));
        props.setSelectedFiles(fileListData);
    }

    const getDirList = async (path) => {
        console.log(path)
        if (path.split("/").slice(-1).pop() !== "emulated" && currentPath !== props.directoryReadPath) {
            let list = []
            await RNFS.readDir(path)
                .then((result) => {
                    for (var i = 0; i < result?.length; i++) {
                        // console.log(JSON.stringify(result[i].name) + "\n")
                        var tmp = result[i];
                        list.push(tmp)
                        // if (result[i].name.endsWith('.txt')) {
                        // console.warn(tmp); // debug
                        // items.push(tmp);
                        // }

                    }
                    // console.warn(items); // empty
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
            // console.log("list", list)
            setFileList(list);
            setCurrentPath(path);
        } else { }
    }

    useEffect(() => {
        getDirList(props.directoryReadPath);
    }, [])


    useEffect(() => {
        if (props?.isFocused) {
            getDirList(props.directoryReadPath);
        }
    }, [props.directoryReadPath])


    return (
        <View style={styles.fileListContainer}>

            <View style={styles.currentPathLabelContainer}>
                <SimpleIcon.Button
                    name="action-undo"
                    backgroundColor={"transparent"}
                    size={20}
                    color={props.selectFile ? TEXT_DISABLED : THEME_WHITE}
                    style={styles.backButton}
                    onPress={(() => {
                        getDirList(currentPath?.split("/").slice(0, -1).join("/"))
                    })}
                    disabled={props.selectFile}
                />
                <Text numberOfLines={1} ellipsizeMode="head" style={styles.currentPathLabel}>{currentPath}</Text>
                {props.selectFile ? <View>
                    <Text style={styles.selectedFileCount}>Selected: {props.selectedFiles?.length}</Text>

                </View> :
                    <AntDIcon.Button
                        name='swap'
                        style={defaultStyles.iconButtonStyle}
                        color={THEME_WHITE}
                        backgroundColor="transparent"
                        size={24}
                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                        onPress={() => { props.toggleDirectoryReadPath() }}
                    />
                }
            </View>

            {!!fileList &&
                <FlatList
                    style={{ width: "100%" }}
                    keyExtractor={(item, index) => `${item?.mtime}-${item?.name}-${index}`}
                    data={fileList}
                    renderItem={({ item, index, separators }) => {
                        if (item.isDirectory() || (item.isFile() && fileExtenstionList.some((extension) => { return item?.name?.endsWith(extension) }))) {
                            return <TouchableNativeFeedback
                                onPress={() => {
                                    if (item.isDirectory()) {
                                        if (props.selectFile) {
                                            // console.log("This is a file");
                                        } else {
                                            getDirList(item.path)
                                        }
                                    } else if (item.isFile() && fileExtenstionList.some((extension) => { return item?.name?.endsWith(extension) })) {
                                        if (props.selectFile) {
                                            // let array = selectedArray;
                                            let array = props.selectedFiles;
                                            if (array.includes(item)) {
                                                array.splice(array.indexOf(item), 1);
                                            } else {
                                                array.push(item);
                                            }
                                            console.log("array", array)
                                            if (array?.length > 0) {
                                                getSelectedFiles(array);
                                                // setState({
                                                //     selectedArray: array
                                                // })
                                            } else if (array?.length === 0) {
                                                getSelectedFiles(array);
                                                props.setMenuItemList()
                                                props.setSelectFile(false);
                                                // setState({
                                                // selectedArray: array,
                                                // selectFile: false
                                                // })
                                            }
                                        } else {
                                            let track = {}
                                            if (props.trackRecords?.some(elem => elem?.url === item?.path)) {
                                                track = props.trackRecords?.find(elem => elem?.url === item?.path);
                                            } else {
                                                track = {
                                                    url: item.path,
                                                    title: item.name
                                                }
                                            }
                                            playTrackWithPath(track);
                                        }
                                    }
                                }}
                                onLongPress={() => {
                                    if (item.isFile() && !props.selectFile) {
                                        // let array = [...selectedArray, index]
                                        let array = [...props.selectedFiles, index]
                                        props.setMenuItemList([ADD_TO_PLAYLIST_MENU_ITEM]);
                                        getSelectedFiles(array);
                                        props.setSelectFile(true)
                                        // setState({
                                        //     selectFile: true,
                                        // selectedArray: array
                                        // })
                                    }
                                }}
                                disabled={props.selectFile && item.isDirectory()}
                                background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                            >
                                <View style={props.selectFile && item.isDirectory() ? styles.disabled : !!props.selectedFiles?.find((element) => element.path === item.path) ? [styles.selected, styles.listItemContainer] : styles.listItemContainer}>
                                    {/* {selectFile && <CheckBox  
                                    />} */}
                                    <SimpleIcon name={`${item.isDirectory() ? "folder" : "music-tone-alt"}`} size={20} color={props.selectFile && item.isDirectory() ? TEXT_DISABLED : THEME_WHITE} />
                                    <Text style={props.selectFile && item.isDirectory() ? styles.disabledText : styles.listElem}>{item.name}</Text>
                                </View>
                            </TouchableNativeFeedback>
                        }
                    }}
                />}

        </View>
    );
}


const mapStateToProps = (state) => {
    return {
        selectedFiles: state.app.selectedFiles,
        selectFile: state.app.selectFile,
        trackRecords: state.data.trackRecords,
        directoryReadPath: state.data.directoryReadPath

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedFiles: (files) => dispatch(setSelectedFiles(files)),
        setSelectFile: (value) => dispatch(setSelectFile(value)),
        toggleDirectoryReadPath: () => dispatch(toggleDirectoryReadPath())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FolderList);