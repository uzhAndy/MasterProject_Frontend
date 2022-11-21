export const roundToNearestRoundNumber = (num: number, max: boolean) => {
    // max describes if the number represents the minimum or maximum

    // find out magnitude of the number (e.g. 10s, 100s, 1000s, ...)
    const nrOfDigits = Math.round(num).toString().length;
    const magnitude = Math.pow(10, nrOfDigits-2)
    // round to that magnitude
    var temp = Math.round(num/magnitude) * magnitude

    console.log("num: " + ((max) ? "max " : "min ") + num)

    if (max) {
        // increase temp by 100 until it is large enough
        while (num > temp) {
            temp += 100
        }
    }

    if (!max) {
        // decrease temp by 100 until it is small enough
        while (num < temp) {
            temp -= 100
        }
        // if num is the min > 0 and the rounded value is < 0, then set to 0
        if (num > 0 && temp < 0) {
            temp = 0
        }
    }
    console.log("rounded: " + ((max) ? "max " : "min ") + temp)
    return temp
}

export const cleanYLabel = (y_label: string, client_currency: string) => {
    var y_label_display = ''
    if (y_label === "Value" || y_label === "NAV") {
        y_label_display = client_currency
    } else {
        y_label_display = y_label
    }
    return y_label_display
}

export const cleanXLabel = (x_label: string) => {
    var x_label_display = ''
    if (x_label === "NAVDate") {
        x_label_display = "Date"
    } else {
        x_label_display = x_label
    }
    return x_label_display
}

