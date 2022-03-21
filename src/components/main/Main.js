import React, { Component, useEffect, useRef, useState } from 'react'
import Header from '../header/Header';
import Player from '../player/Player';
import { NativeModules, Dimensions, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, BackHandler, UIManager, findNodeHandle } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { ADD_TO_PLAYLIST_MENU_ITEM, SELECT_ALL_MENU_ITEM, THEME_BLUE_FOREGROUND, THEME_TAB_BACKGROUND, THEME_WHITE } from '../../../Constants';
import FolderList from '../fileList/FolderList';
import store from '../../store/store';
import { getFiles, setModalContent, toggleLoader, togglePlayer } from '../../store/actions';
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
    const [menuItems, setMenuItems] = useState([])
    const routes = [
        { key: "songs", title: "Songs" },
        { key: 'folder', title: 'Folder' },
        { key: "playlists", title: "Playlists" },
        { key: 'test', title: 'Test' },
        { key: "search", title: " YouTube Search" }
    ];
    // const renderScene = SceneMap({
    //     songs: FileList,
    //     first: FolderList,
    //     test: Test
    // })
    const renderScene = ({ route }) => {
        switch (route.key) {
            case "songs":
                return <FileList />
            case "folder":
                return <FolderList setMenuItemList={setMenuItemList} />
            case "test":
                return <Test />
            case "search":
                return <SearchYoutube />
            case "playlists":
                return <Playlists />
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
        if (props.allFiles?.length === 0) {
            props.toggleLoader(true)
            getFiles(RNFS.ExternalStorageDirectoryPath);
        }
    }, [])

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
            if (props.displayPlayer) {
                props.togglePlayer(false);
                return true;
            } else {
                return false;
            }
        }
    );

    const handleIndexChange = (indexValue) => {
        // switch (indexValue) {
        //     case indexValue:

        //         break;

        //     default:
        //         break;
        // }
        setIndex(indexValue)
    }

    const selectMenuItem = (item, index) => {
        if (item !== "itemSelected") return;
        switch (menuItems[index]) {
            case SELECT_ALL_MENU_ITEM: console.log("select all"); break;
            case ADD_TO_PLAYLIST_MENU_ITEM: console.log("add to playlist", index, props.selectedFiles); break;
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
        <>
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
                <Player />
                <ErrorModal />
            </View>
            {props.displayLoader ? <Loader /> : null}
        </>
    );
    // }
}

const mapStateToProps = (state) => {
    return {
        allFiles: state.app.allFiles,
        displayLoader: state.app.displayLoader,
        displayPlayer: state.app.displayPlayer,
        selectedFiles: state.app.selectedFiles
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value)),
        togglePlayer: (value) => dispatch(togglePlayer(value)),
        setModalContent: (content) => dispatch(setModalContent(content)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

// export const Main = (props) => {
//     const layout = useWindowDimensions();
//     const [index, setIndex] = React.useState(0);
//     const [routes] = React.useState([
//         { key: 'first', title: 'First' },
//         { key: 'second', title: 'Second' },
//     ]);
//     const renderScene = SceneMap({
//         first: FolderList,
//         second: Player
//     })


//     return (
//         <>
//             <Header />
//             <View style={{ width: "100%", height: "100%" }}>
//                 <TabView
//                     navigationState={{ index, routes }}
//                     onIndexChange={setIndex}
//                     renderScene={renderScene}
//                     initialLayout={{ width: layout.width }}
//                     renderTabBar={(props) => {
//                         return <TabBar
//                             {...props}
//                             indicatorStyle={{ backgroundColor: THEME_BLUE_FOREGROUND }}
//                             labelStyle={styles.tabItemText}
//                             style={styles.tabBar}
//                             pressColor={THEME_BLUE_FOREGROUND}
//                         />
//                     }}
//                 />

//             </View>
//         </>
//     );

// }
