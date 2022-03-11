import React from 'react';
import { View, Modal, Text, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { ERROR_RED, THEME_BLACK_BACKGROUND, THEME_OFF_WHITE, THEME_WHITE, TRANSPARENT_BLACK, WARNING_YELLOW } from '../../../Constants';
import { resetModalContent } from '../../store/actions';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
    modalViewBackground: {
        height: "100%",
        width: "100%",
        backgroundColor: TRANSPARENT_BLACK,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContentContainer: {
        minWidth: "50%",
        maxWidth: "80%",
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: THEME_OFF_WHITE,
        alignItems: "center",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    iconStyle: {
        margin: 10
    },
    modalTextStyle: {
        color: THEME_BLACK_BACKGROUND,
        margin: 10,
        fontSize: 16
    },
    buttonStyle: {
        margin: 10,
        borderRadius: 5
    },
    buttonTextStyle: {
        color: THEME_WHITE,
        marginVertical: 5,
        marginHorizontal: 10,
        fontSize: 14
    }
})
const ErrorModal = (props) => {
    const buttonTypes = {
        error:
        {
            icon: <MaterialIcon name="error-outline" size={40} color={ERROR_RED} style={styles.iconStyle} />,
            buttonContent: [
                {
                    title: "Close",
                    action: () => props.resetModalContent(),
                    style: {
                        backgroundColor: ERROR_RED
                    }
                }
            ]
        },
        warning:
        {
            icon: <Icon name="warning" size={40} color={WARNING_YELLOW} style={styles.iconStyle} />,
            buttonContent: [
                {
                    title: "Close",
                    action: () => props.resetModalContent(),
                    style: {
                        backgroundColor: WARNING_YELLOW
                    }
                }
            ]
        }
        ,

    }
    const modalType = props.modalState?.type === "custom" ? props.modalState?.buttons : buttonTypes.hasOwnProperty(props.modalState?.type) ? buttonTypes[props.modalState?.type] : buttonTypes["error"];
    return (
        <Modal
            style={{ height: "100%", width: "100%" }}
            animationType='fade'
            transparent={true}
            visible={props.modalState?.visible || false}
            onRequestClose={() => props.resetModalContent()}
        >
            <View style={styles.modalViewBackground}>
                <View style={styles.modalContentContainer} >
                    {modalType?.icon}
                    <Text style={styles.modalTextStyle}>{props.modalState?.content}</Text>
                    <View>
                        {modalType?.buttonContent?.map((content, index) => {
                            return <TouchableOpacity key={index} style={[styles.buttonStyle, content?.style]} onPress={content?.action}>
                                <Text style={styles.buttonTextStyle}>{content?.title}</Text>
                            </TouchableOpacity>
                        })}
                    </View>

                </View>
            </View>
        </Modal>
    )
}
const mapStateToProps = (state) => {
    return {
        modalState: state.app.modalState
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        resetModalContent: () => dispatch(resetModalContent()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);