import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function CustomerInformation({ tab, setCustomerInformation, customerInformation, editing }) {
    const [name, setName] = useState(customerInformation.name ? customerInformation.name : 'John Doe')
    const [address, setAddress] = useState(customerInformation.address ? customerInformation.address : '123 Main St')
    const [city, setCity] = useState(customerInformation.city ? customerInformation.city : 'Phoenix')
    const [state, setState] = useState(customerInformation.state ? customerInformation.state : 'AZ')
    const [zip, setZip] = useState(customerInformation.zip ? customerInformation.zip : 60085)
    const [phone, setPhone] = useState(customerInformation.phone ? customerInformation.phone : 9378466871)
    const [email, setEmail] = useState(customerInformation.email ? customerInformation.email : 'johndoe@gmail.com')


    useEffect(() => {
        const payload = { name, address, city, state, zip, phone, email }
        setCustomerInformation(payload)
    }, [tab])

    console.log(editing)

    return (
        <>
            <KeyboardAwareScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Text category='h5' style={{ marginBottom: 10 }}>Customer Information</Text>
                        <Input size="medium" style={styles.input} value={name} onChangeText={(e) => { setName(e) }} label="Customer name" placeholder="John Doe" />
                        <Input size="medium" style={styles.input} value={address} onChangeText={(e) => { setAddress(e) }} label="Address" placeholder="123 1st Street" />
                        <Input size="medium" style={styles.input} value={city} onChangeText={(e) => { setCity(e) }} label="City" placeholder="Chicago" />
                        <View style={{ flexDirection: 'row' }}>
                            <Input size="medium" style={[styles.input, { flex: 1, marginRight: 5 }]} value={state} onChangeText={(e) => { setState(e) }} label="State/Province" placeholder="IL" />
                            <Input keyboardType="numeric" size="medium" style={[styles.input, { flex: 1, marginLeft: 5 }]} value={zip} onChangeText={(e) => { setZip(e) }} label="Zip/Postal code" />
                        </View>
                        <Input keyboardType="phone-pad" autoComplete="tel" size="medium" style={styles.input} value={phone} onChangeText={(e) => { setPhone(e) }} label="Phone" placeholder="000-000-0000" />
                        <Input keyboardType="email-address" size="medium" style={styles.input} value={email} onChangeText={(e) => { setEmail(e) }} label="Email" placeholder="johndoe@gmail.com" />

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        </>
    )

}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    input: {
        marginTop: 10,
    }
});