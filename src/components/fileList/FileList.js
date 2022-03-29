import React from 'react'
import { StyleSheet, View, FlatList, TouchableNativeFeedback, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import { THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import { playTrack, playTrackWithIndex } from '../player/service';
import { getFiles } from '../../utility/store/action';
import * as RNFS from "react-native-fs";
import { toggleLoader } from '../../store/actions';

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
    return (
        <View style={styles.fileListContainer}>
            <Button title='Refresh' onPress={() => {
                props.toggleLoader(true)
                getFiles(RNFS.ExternalStorageDirectoryPath)
            }} />
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
            />

        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        displayLoader: state.app.displayLoader,
        allFiles: state.data.allFiles
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoader: (value) => dispatch(toggleLoader(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)