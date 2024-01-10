import { Card, Layout, List, ListItem, Text, Button, Divider, CheckBox, Modal } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { Image } from 'expo-image';
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TermsModal from "../modals/TermsModal";


const renderItem = ({ item, index }) => {
    return (
        <>
            <ListItem style={{ marginHorizontal: -5 }} accessoryLeft={(props) => (<Image style={{ width: 75, height: 75, borderRadius: 5 }} source={item.source} />)} title={props => <Text style={{ marginHorizontal: 10, fontSize: 18, fontWeight: 500 }}>{item.name}</Text>} description={des => <View style={{ marginHorizontal: 10 }}><Text category="c1">{item.requirements.map((require) => require.name).join(', ')}</Text><Text category="c2">${item.estimate}</Text></View>} />
        </>
    )
}


export default function Confirmation({ jobInformation, customerInformation, schedulingInformation }) {
    const [visible, setVisible] = useState(false)
    const [confirm, setConfirm] = useState(false)
    function formatDate(d) {
        // Get the components of the date
        const year = d.getFullYear();
        const month = d.getMonth() + 1; // getMonth() returns 0-11
        const day = d.getDate();


        // Format the date string
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }


    return (
        <KeyboardAwareScrollView>
            <Layout style={{ padding: 10 }}>
                {customerInformation?.name &&
                    <Card style={styles.cardContainer} header={(props) => (
                        <View style={styles.cardHeader}>
                            <Text category='h6'>
                                Customer Information
                            </Text>
                        </View>
                    )}>
                        <Text category="s1">
                            Name: {customerInformation.name}
                        </Text>
                        <Text category="s1">
                            Address: {customerInformation.address} {customerInformation.city}, {customerInformation.state} {customerInformation.zip}
                        </Text>
                        <Text category="s1">
                            Phone: {customerInformation.phone}
                        </Text>
                        <Text category="s1">
                            Email: {customerInformation.email}
                        </Text>
                    </Card>}
                {jobInformation.length > 0 &&
                    <Card style={styles.cardContainer} header={(props) => (
                        <View style={styles.cardHeader}>
                            <Text category='h6'>
                                Job Information
                            </Text></View>
                    )}>
                        <List data={jobInformation} renderItem={renderItem} />

                    </Card>
                }

                {schedulingInformation?.startDate && <Card style={styles.cardContainer} header={(props) => {

                    return (
                        <View style={styles.cardHeader}>
                            <Text category='h6'>
                                Scheduling Information
                            </Text>
                        </View>
                    )
                }
                }>
                    <Text category="s1">Start Date: {formatDate(new Date(schedulingInformation.startDate))}</Text>
                    <Text category="s1">Finish Date: {formatDate(new Date(schedulingInformation.finishDate))}</Text>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text>{schedulingInformation.comment}</Text>
                </Card>

                }


                <View style={{ flexDirection: "row-reverse", alignItems: 'center', justifyContent: "center" }}>
                    <Button size="small" onPress={() => { setVisible(true) }}>View</Button>
                    <CheckBox checked={confirm} onChange={() => { setConfirm(!confirm) }} style={{ marginTop: 10 }}>Accept All <Text status="info">Terms and Conditions</Text></CheckBox>
                </View>
                <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                    <TermsModal setVisible={setVisible} />
                </Modal>
            </Layout>
        </KeyboardAwareScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        marginTop: 10,
    },
    cardContainer: {
        margin: 10
    },
    cardHeader: {
        padding: 10,

    }
});