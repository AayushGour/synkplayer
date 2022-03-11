import React from 'react'
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import { THEME_WHITE, TRANSPARENT_BLACK, WARNING_YELLOW } from '../../../Constants';

const styles = StyleSheet.create({
    noDataContainer: {
        width: "100%",
        height: "100%",
        alignItems: 'center',
        backgroundColor: TRANSPARENT_BLACK,
        justifyContent: 'center',
        position: 'absolute'
    },
    noDataText: {
        color: THEME_WHITE,
        fontSize: 20,
        marginTop: 10,
    }
})

const NoData = (props) => {
    return (
        <View style={styles.noDataContainer}>
            <Icon name="warning" size={40} color={WARNING_YELLOW} />
            <Text style={styles.noDataText}>No Data Available</Text>
        </View>
    )
}
export default NoData;