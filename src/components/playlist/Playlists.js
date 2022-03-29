import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native'
import { connect } from 'react-redux';
const styles = StyleSheet.create({
    playlistContainer: {
        width: "100%"
    }
})


const Playlists = (props) => {
    return <View style={styles.playlistContainer}>
        <FlatList
            data={props?.playlists}
        />
    </View>
}

const mapStateToProps = (state) => {
    return {
        playlists: state.playlist.playlists
    }
}
const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Playlists);