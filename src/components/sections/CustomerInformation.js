import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function CustomerInformation({ tab, setCustomerInformation }) {
    const [name, setName] = useState('John Doe')
    const [address, setAddress] = useState('123 Main St')
    const [city, setCity] = useState('Chicago')
    const [state, setState] = useState('IL')
    const [zip, setZip] = useState(60065)
    const [phone, setPhone] = useState(9378466871)
    const [email, setEmail] = useState('johndoe@gmail.com')


    useEffect(() => {
        const payload = { name, address, city, state, zip, phone, email }
        setCustomerInformation(payload)
    }, [tab])

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
                            <Input keyboardType="numeric" size="medium" style={[styles.input, { flex: 1, marginLeft: 5 }]} value={zip} onChangeText={(e) => { setZip(e) }} label="Zip/Postal code" placeholder="00000" />
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