import { LinearGradient } from 'expo-linear-gradient';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, VirtualizedList } from 'react-native';
import { Button } from 'react-native-elements';
import { padding, THEME_BLACK_BACKGROUND, THEME_TAB_BACKGROUND, THEME_WHITE } from '../../Constants';
import { homeTabs } from '../../MenuItems';

const styles = StyleSheet.create({
    homeView: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        color: THEME_WHITE
    },
    whiteFont: {
        color: THEME_WHITE
    },
    tabsRootContainer: {
        height: 50
    },
    tabsContainerStyle: {
        display: "flex",
        flexDirection: "row"
    },
    tabItemDefault: {
        ...padding(10, 10),
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: THEME_TAB_BACKGROUND,
        color: THEME_WHITE,
        fontWeight: "normal"
    },
    tabViewRootContainer: {
        flex: 1
    },
    tabViewContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        color: THEME_WHITE,
        flex: 1
    }
})

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0
        };
    }
    setTabValue = (value) => {
        this.setState({ tabValue: value })
    }
    getItem = (data, index) => (Math.random().toString(12).substring(0));

    getItemCount = (data) => 10;
    render() {
        return (
            <View style={styles.homeView}>
                <View style={styles.tabsRootContainer}>
                    <ScrollView horizontal={true} contentContainerStyle={styles.tabsContainerStyle} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
                        {homeTabs.map(element => {
                            return <Button
                                title={element.name}
                                key={element.name + "tabs" + element.id}
                                buttonStyle={styles.tabItemDefault}
                                onPress={() => this.setTabValue(element.id)}
                                ViewComponent={LinearGradient}
                                linearGradientProps={{
                                    colors: this.state.tabValue === element.id ? [THEME_BLACK_BACKGROUND, "#01a4e9aa", THEME_WHITE] : [THEME_BLACK_BACKGROUND, THEME_BLACK_BACKGROUND],
                                    locations: this.state.tabValue === element.id ? [0.8, 0.95, 1] : [0.5, 1],
                                }}
                            />
                        })}
                    </ScrollView>
                </View>
                <View style={styles.tabViewRootContainer}>
                    {/* <ScrollView contentContainerStyle={styles.tabViewContainer} showsHorizontalScrollIndicator={false}>
                        {[1, 2, 3, 4, 5, 6, 7].map(elem => {
                            return <Text style={{ color: THEME_WHITE }}>{elem}</Text>
                        })}
                    </ScrollView> */}
                    {/* <VirtualizedList
                        initialNumToRender={4}
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        renderItem={({ item }) => <Text style={{ color: THEME_WHITE }} key={item}>{item}</Text>}
                        getItem={this.getItem}
                        getItemCount={this.getItemCount}
                    /> */}
                </View>

            </View >

        );
    }
}

export default Home;