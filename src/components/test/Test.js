import React from 'react';
import { Button, View } from 'react-native';
import * as RNFS from "react-native-fs";
import MediaMeta from "react-native-media-meta";
import TrackPlayer from 'react-native-track-player';
import ytdl from 'react-native-ytdl';
import ytsr from "react-native-ytsr";
import { connect } from 'react-redux';
import { addToPlaylist } from '../playlist/store/action';

const Test = (props) => {
    return (
        <View style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Button title={"Pause"} onPress={async () => {
                await TrackPlayer.pause();
            }} />
            <Button title={"Reset list"} onPress={async () => {
                await TrackPlayer.reset()
            }} />
            <Button title={"Print list"} onPress={async () => {
                await TrackPlayer.getQueue().then(e => console.log(e))
            }} />
            <Button title={"Youtube download"} onPress={async () => {
                const youtubeURL = 'http://www.youtube.com/watch?v=04GiqLjRO3A';
                const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
                console.log(urls)
                let dat = RNFS.downloadFile({
                    fromUrl: urls[0].url,
                    toFile: `${RNFS.DownloadDirectoryPath}/"testmp3.mp3`,
                    background: true,
                    cacheable: false
                })
                console.log(dat);
                console.log(await dat.promise)
                // await TrackPlayer.reset();
                // await TrackPlayer.add(urls);
                // await TrackPlayer.play()
            }} />
            <Button title={"Youtube Search"} onPress={async () => {
                let search = await ytsr("blastoyz")
                console.log(search)
            }} />
            <Button title={"Meta Data"} onPress={async () => {
                MediaMeta.get("/storage/emulated/0/Download/Eminem - Venom.webm").then((res) => console.log(res));

            }} />
            <Button title={"Add to playlist"} onPress={async () => {
                props.addToPlaylist({ name: "test", url: "something" });
            }} />
            <Button title={"Search Name"} onPress={async () => {
                console.log(props.playlists?.find((elem) => elem.name === "test"))
            }} />
            <Button title={"Youtube Info"} onPress={async () => {
                let search = await ytdl.getInfo("https://www.youtube.com/watch?v=8CdcCD5V-d8", { quality: 'highestaudio', filter: "audio" })
                console.log(search)
                let format = ytdl.chooseFormat(search.formats, { quality: 'highestaudio', filter: "audio" })
                console.log(format, `${RNFS.DownloadDirectoryPath}/${search?.videoDetails?.title}.${format?.container}`)
                let downloadOptions = {
                    fromUrl: format?.url,
                    toFile: `${RNFS.DownloadDirectoryPath}/${search?.videoDetails?.title}.${format?.container}`,
                    background: true,
                    cacheable: false,
                    progress: (val) => console.log(val)
                }
                let download = RNFS.downloadFile(downloadOptions)
                download.promise.then(resp => {
                    console.log(resp)
                })
            }} />

        </View>
    );

}
const mapStateToProps = (state) => {
    return {
        playlists: state.playlist.playlists
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addToPlaylist: (track) => dispatch(addToPlaylist(track))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Test);