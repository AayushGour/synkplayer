import React, { Component, useEffect, useState } from 'react'
import Header from '../header/Header';
import Player from '../player/Player';
import { Dimensions, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, BackHandler } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { THEME_BLUE_FOREGROUND, THEME_TAB_BACKGROUND, THEME_WHITE } from '../../../Constants';
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

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: THEME_TAB_BACKGROUND,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_TAB_BACKGROUND
    },
    tabItemText: {
        fontFamily: "Montserrat-Regular",
        color: THEME_WHITE
    }
})

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // allFiles: [],
            index: 0,
            routes: [
                { key: "songs", title: "Songs" },
                { key: 'first', title: 'First' },
                { key: 'test', title: 'Test' },
            ]
        };
        this.layout = Dimensions.get("window");

    }
    renderScene = SceneMap({
        songs: FileList,
        first: FolderList,
        test: Test
    })

    componentDidMount = async () => {
        addTracks();
        if (this.props.allFiles?.length === 0) {
            this.props.toggleLoader(true)
            getFiles(RNFS.ExternalStorageDirectoryPath);
        }
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (this.props.displayPlayer) {
                    this.props.togglePlayer(false);
                    return true;
                } else {
                    return false;
                }
            }
        );
    }

    render() {
        return (
            <>
                <Header />
                <View style={{ width: "100%", flex: 1 }}>
                    <TabView
                        navigationState={{ index: this.state.index, routes: this.state.routes }}
                        onIndexChange={(value) => this.setState({ index: value })}
                        renderScene={this.renderScene}
                        initialLayout={{ width: this.layout.width }}
                        renderTabBar={(props) => {
                            return <TabBar
                                {...props}
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
                {this.props.displayLoader ? <Loader /> : null}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        allFiles: state.app.allFiles,
        displayLoader: state.app.displayLoader,
        displayPlayer: state.app.displayPlayer
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
