export const THEME_BLUE_FOREGROUND = "#01a4e9";
export const THEME_BLACK_BACKGROUND = "#121212";
export const THEME_TAB_BACKGROUND = "#1a1a1a";
export const THEME_WHITE = "#FFFFFF";
export const TRANSPARENT_BLACK = "rgba(0,0,0,0.7)";
export const customFonts = {
    Montserrat: require("./src/assets/fonts/Montserrat-Regular.ttf")
}
export const padding = (a, b, c, d) => ({
    paddingTop: a,
    paddingRight: b ?? a,
    paddingBottom: c ?? a,
    paddingLeft: d ?? b ?? a,
})