import React, { Component, useEffect, useRef, useState } from 'react'
import Header from '../header/Header';
import Player from '../player/Player';
import { NativeModules, Dimensions, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, BackHandler, UIManager, findNodeHandle } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { ADD_TO_PLAYLIST_MENU_ITEM, FILE_STORAGE_DIRECTORY, SELECT_ALL_MENU_ITEM, THEME_BLUE_FOREGROUND, THEME_TAB_BACKGROUND, THEME_WHITE } from '../../../Constants';
import FolderList from '../fileList/FolderList';
import { resetSelectedFiles, setModalContent, setSelectFile, toggleLoader, togglePlayer } from '../../store/actions';
import * as RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import Loader from '../../utility/loader/Loader';
import FileList from '../fileList/FileList';
import Footer from '../footer/Footer';
import Test from '../test/Test';
import TrackPlayer, { State } from 'react-native-track-player';
import { addTracks } from '../player/service';
import ErrorModal from '../../utility/modal/ErrorModal';
import SearchYoutube from '../search/Search';
import Playlists from '../playlist/Playlists';
import { getFiles } from '../../utility/store/action';
import PlaylistModal from '../../utility/modal/PlaylistModal';
import { NavigationContainer } from '@react-navigation/native';

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: THEME_TAB_BACKGROUND
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_TAB_BACKGROUND
    },
    tabItemText: {
        fontFamily: "Montserrat-Regular",
        color: THEME_WHITE,
        textAlign: "center"
    }
})

// class Main extends Component {
const Main = (props) => {
    const [selectedItems, setSelectedItems] = useState([])
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [icon, setIcon] = useState();
    const [menuItems, setMenuItems] = useState([]);
    const [displayPlaylistModal, setDisplayPlaylistModal] = useState(false)
    const routes = [
        { index: 0, key: "songs", title: "Songs" },
        { index: 1, key: 'folder', title: 'Folders' },
        { index: 2, key: "playlists", title: "Playlists" },
        { index: 3, key: 'test', title: 'Test' },
        { index: 4, key: "search", title: " YouTube Search" }
    ];
    // const renderScene = SceneMap({
    //     songs: FileList,
    //     first: FolderList,
    //     test: Test
    // })
    const renderScene = ({ route, jumpTo, position }) => {
        switch (route.key) {
            case "songs":
                return <FileList isFocused={index === route?.index} />
            case "folder":
                return <FolderList isFocused={index === route?.index} setMenuItemList={setMenuItemList} />
            case "test":
                return <Test isFocused={index === route?.index} />
            case "search":
                return <SearchYoutube isFocused={index === route?.index} />
            case "playlists":
                return <Playlists isFocused={index === route?.index} />
            default:
                return null;
        }
    }
    useEffect(() => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(async response => {
            if (!response) {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                ).then((resp) => {
                    NativeModules.DevSettings.reload();
                })
            }
        })
        TrackPlayer.setVolume(1);
        if (props.allFiles?.length === 0) {
            props.toggleLoader(true)
            getFiles(props.directoryReadPath);
        }
        RNFS.exists(FILE_STORAGE_DIRECTORY).then(async resp => {
            if (!resp) {
                await RNFS.mkdir(FILE_STORAGE_DIRECTORY);
            }
        })
    }, [])

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
            if (props.displayPlayer) {
                props.togglePlayer(false);
                return true;
            } else if (props.selectFile) {
                props.setSelectFile(false);
                props.resetSelectedFiles();
                return true;
            } else {
                return false;
            }
        }
    );

    const handleIndexChange = (indexValue) => {
        props.resetSelectedFiles();
        setMenuItemList();
        switch (indexValue) {
            case 0:
                console.log("songs")
                break;
            case 1:
                console.log("folderlist")
                break;

            default:
                break;
        }
        setIndex(indexValue)
    }

    const selectMenuItem = (item, index) => {
        if (item !== "itemSelected") return;
        switch (menuItems[index]) {
            case SELECT_ALL_MENU_ITEM: console.log("select all"); break;
            case ADD_TO_PLAYLIST_MENU_ITEM:
                setDisplayPlaylistModal(true);
                break;
            default: break;
        }
    }

    const showPopupMenu = () => {
        UIManager.showPopupMenu(findNodeHandle(icon), menuItems, (error) => { console.log(error) }, selectMenuItem)
    }


    const onRef = icon => {
        if (!!icon) {
            setIcon(icon);
        }
    }

    const setMenuItemList = (itemArray = []) => {
        setMenuItems(itemArray);
    }

    // render() {
    return (
        <NavigationContainer>
            <Header onRef={onRef} showPopupMenu={showPopupMenu} showMenuIcon={menuItems.length > 0} />
            <View style={{ width: "100%", flex: 1 }}>
                <TabView
                    navigationState={{ index, routes }}
                    onIndexChange={(value) => handleIndexChange(value)}
                    renderScene={renderScene}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={(props) => {
                        return <TabBar
                            {...props}
                            scrollEnabled={true}
                            indicatorStyle={{ backgroundColor: THEME_BLUE_FOREGROUND }}
                            labelStyle={styles.tabItemText}
                            style={styles.tabBar}
                            pressColor={THEME_BLUE_FOREGROUND}
                        />
                    }}
                />
                <Footer />
                <ErrorModal />
                <PlaylistModal visible={displayPlaylistModal} closeModal={() => setDisplayPlaylistModal(false)} />
            </View>
            <Player />
            {props.displayLoader ? <Loader /> : null}
        </NavigationContainer>
    );
    // }
}

const mapStateToProps = (state) => {
    return {
        allFiles: state.data.allFiles,
        displayLoader: state.app.displayLoader,
        displayPlayer: state.app.displayPlayer,
        selectedFiles: state.app.selectedFiles,
        selectFile: state.app.selectFile,
        directoryReadPath: state.data.directoryReadPath
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value)),
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content)),
        resetSelectedFiles: () => dispatch(resetSelectedFiles()),
        setSelectFile: (value) => dispatch(setSelectFile(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);