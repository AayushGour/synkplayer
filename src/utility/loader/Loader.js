import React from 'react'
import { View, StyleSheet, Dimensions, Text, Platform, StatusBar } from 'react-native'
import { THEME_BLUE_FOREGROUND, THEME_WHITE, TRANSPARENT_BLACK } from '../../../Constants'
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
    loaderContainer: {
        height: "100%",
        width: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: TRANSPARENT_BLACK,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    loader: {
        // width: "50%",
        // height: "50%",
        borderColor: "red",
        // borderWidth: 3,
        backgroundColor: "transparent",
        borderRadius: 50,
        transform: [
            { perspective: 800 }
        ],
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner: {
        position: "absolute",
        borderRadius: 50,
        height: 100,
        width: 100,
        // borderColor: "green",
        // borderWidth: 6
    },
    one: {
        // top: 0,
        // left: 0,
        borderLeftColor: THEME_BLUE_FOREGROUND,
        borderLeftWidth: 6,
        borderRightColor: THEME_WHITE,
        borderRightWidth: 6,
        // borderBottomColor: THEME_BLUE_FOREGROUND,
        // borderBottomWidth: 1,
        // borderTopColor: THEME_BLUE_FOREGROUND,
        // borderTopWidth: 1,
    },
    two: {
        // right: 0,
        // top: 0,
        borderLeftColor: THEME_BLUE_FOREGROUND,
        borderLeftWidth: 6,
        borderRightColor: THEME_WHITE,
        borderRightWidth: 6,
        // borderBottomColor: THEME_BLUE_FOREGROUND,
        // borderBottomWidth: 1,
        // borderTopColor: THEME_BLUE_FOREGROUND,
        // borderTopWidth: 1,

    },
    three: {
        // right: 0,
        // bottom: 0,
        borderLeftColor: THEME_WHITE,
        borderLeftWidth: 6,
        borderRightColor: THEME_BLUE_FOREGROUND,
        borderRightWidth: 6,
        // borderBottomColor: THEME_BLUE_FOREGROUND,
        // borderBottomWidth: 1,
        // borderTopColor: THEME_BLUE_FOREGROUND,
        // borderTopWidth: 1,
    }
})

const one = {
    from: {
        rotateX: '35deg',
        rotateY: '-45deg',
        rotateZ: '0deg',
    },
    to: {
        rotateX: '35deg',
        rotateY: '-45deg',
        rotateZ: '360deg',
    }
}
const two = {
    from: {
        rotateX: '50deg',
        rotateY: '10deg',
        rotateZ: '0deg',
    },
    to: {
        rotateX: '50deg',
        rotateY: '10deg',
        rotateZ: '360deg',
    }
}
const three = {
    from: {
        rotateX: '35deg',
        rotateY: '55deg',
        rotateZ: '0deg',
    },
    to: {
        rotateX: '35deg',
        rotateY: '55deg',
        rotateZ: '360deg',
    }
}


const Loader = (props) => {
    return (
        <View style={[styles.loaderContainer, props?.style?.loaderContainer]}>
            <Animatable.View style={styles.loader} useNativeDriver={true}>
                <Animatable.View
                    style={[styles.inner, styles.one]}
                    animation={one}
                    iterationCount="infinite"
                    useNativeDriver={true}
                    easing="linear"></Animatable.View>

                <Animatable.View
                    style={[styles.inner, styles.two]}
                    animation={two}
                    iterationCount="infinite"
                    useNativeDriver={true}
                    easing="linear"
                ></Animatable.View>
                <Animatable.View
                    style={[styles.inner, styles.three]}
                    animation={three}
                    iterationCount="infinite"
                    useNativeDriver={true}
                    easing="linear"
                ></Animatable.View>
            </Animatable.View>
        </View>
    )
}

export default Loader;
