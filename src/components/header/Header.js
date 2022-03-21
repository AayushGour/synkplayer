import React, { Component } from 'react'
import { Image, PermissionsAndroid, StyleSheet, Text, View, UIManager, findNodeHandle, TouchableHighlight } from 'react-native';
import { defaultStyles, THEME_BLUE_FOREGROUND, THEME_WHITE } from '../../../Constants';
import * as RNFS from 'react-native-fs';
import Logo from "../../../assets/images/SynkLogo.png"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const styles = StyleSheet.create({
    headerContainer: {
        alignSelf: "stretch",
        height: 50,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        width: "100%",
        borderBottomColor: THEME_BLUE_FOREGROUND,
        borderBottomWidth: 2,
    },
    headerTitle: {
        color: THEME_WHITE,
        fontSize: 20,
        fontFamily: "Charmonman-Regular",
        paddingLeft: 6,
        flex: 1
    },
    logo: {
        width: 40,
        height: 40
    },
    menu: {
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
        paddingVertical: 5
    }
})

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }
    componentDidMount = async () => {
        // console.log(RNFS.ExternalStorageDirectoryPath)
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // RNFS.writeFile(RNFS.ExternalStorageDirectoryPath + "/text.txt", 'Lorem ipsum dolor sit amet', 'utf8')
        //     .then((success) => {
        //         console.log('FILE WRITTEN!');
        //     })
        //     .catch((err) => {
        //         console.log(err.message);
        //     });
        // let list = []
        // await RNFS.readDir(RNFS.ExternalStorageDirectoryPath)
        //     .then((result) => {
        //         console.log('GOT RESULT', result);

        //         for (var i = 0; i < result.length; i++) {
        //             console.log(JSON.stringify(result[i]) + "\n")
        //             var tmp = result[i].name;
        //             list.push(tmp)
        //             // if (result[i].name.endsWith('.txt')) {
        //             // console.warn(tmp); // debug
        //             // items.push(tmp);
        //             // }

        //         }
        //         // console.warn(items); // empty
        //     })
        //     .catch((err) => {
        //         console.log(err.message, err.code);
        //     });
        // // console.log(file)
        // this.setState({ fileList: list })
        // }
    }

    render() {
        return (
            <View style={styles.headerContainer}>
                <Image source={Logo} style={styles.logo} />
                <Text style={styles.headerTitle}>Synk Music</Text>
                {/* {this.state.fileList?.map((item, index) => {
                    return <Text style={styles.headerTitle} key={item + index}>{item}</Text>
                })} */}
                {this.props.showMenuIcon ?
                    <TouchableHighlight ref={(ref) => this.props.onRef(ref)} style={styles.menu} onPress={this.props.showPopupMenu}>
                        <Icon name="dots-vertical" color={THEME_WHITE} size={24} backgroundColor="transparent" style={defaultStyles.iconButtonIconStyle} />
                    </TouchableHighlight>
                    : null}

            </View>
        );
    }
}

export default Header;