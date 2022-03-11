import React from 'react'
import { StyleSheet, View, FlatList, TouchableNativeFeedback, Text } from 'react-native'
import { connect } from 'react-redux'
import { THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

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
            <FlatList
                style={{ width: "100%" }}
                keyExtractor={(item, index) => `${item.cTime}-${item.path}`}
                data={props.allFiles}
                renderItem={({ item, index, separators }) => {
                    return <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(THEME_BLUE_FOREGROUND, false)}
                        onPress={() => {
                            console.log(item.path, index)
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
        allFiles: state.app.allFiles
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)