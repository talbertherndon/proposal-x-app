import { Layout, Tab, TabView, Text, Button, useTheme, useStyleSheet, StyleService } from '@ui-kitten/components';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';
import CustomerInformation from '../components/sections/CustomerInformation';
import JobInformation from '../components/sections/JobInformation';
import Confirmation from '../components/sections/Confirmation';
import Scheduling from '../components/sections/Scheduling';
import * as MailComposer from 'expo-mail-composer';
import { generatePdf } from '../utils/generate-pdf';
import { shareAsync } from 'expo-sharing';
import { createProject, editProject } from '../../api';


export default function ProjectScreen({ route, navigation }) {
    const theme = useTheme();
    const params = route.params
    const [tab, setTab] = useState(0);
    const [customerInformation, setCustomerInformation] = useState(params ? { name: params.name, address: params.address, city: params.city, state: params.state, zip: params.zip, phone: params.phone, email: params.email } : {});
    const [jobInformation, setJobInformation] = useState(params ? params.areas : []);
    const [schedulingInformation, setSchedulingInformation] = useState(params ? { start: params.start, finish: params.finish, comment: params.notes } : {});
    const [editing, setEditing] = useState(!!params)
    const [isAvailable, setIsAvailable] = useState(false);

    function calculateTotal() {
        return parseFloat(jobInformation.reduce((total, item) => total + item.estimate, 0).toFixed(2))
    }

    async function editProjectHandler() {
        const payload = { ...customerInformation, areas: jobInformation, ...schedulingInformation, cost: calculateTotal(), id: params.id }
        console.log("EDITING:", payload)
        const uri = await generatePdf(payload, payload.areas, false)
        MailComposer.composeAsync({
            subject: "A change has been made to your CQ Painting Proposal!",
            body: "Please review changed made to your porposal.",
            recipients: [payload.email, "talbertherndon1@gmail.com"],
            attachments: [uri]
        }).then((r) => {
            if (r.status == 'sent') {
                editProject(payload, params.id)
                navigation.navigate('Home');
            } else {
                Alert.alert("Must re-send proposal to save project!")

            }

        })


    }

    async function downloadProject() {
        const payload = { ...customerInformation, areas: jobInformation, ...schedulingInformation, cost: calculateTotal() }
        console.log(payload)
        const uri = await generatePdf(payload, payload.areas, true)
        shareAsync(uri);
    }
    async function addProjectHandler() {
        const payload = { ...customerInformation, areas: jobInformation, ...schedulingInformation, cost: calculateTotal() }
        console.log(payload)
        const uri = await generatePdf(payload, payload.areas, true)
        // shareAsync(uri);

        MailComposer.composeAsync({
            subject: "You have recieved a project proposal from CQ Painting!",
            body: "Attached below is your proposal:",
            recipients: [payload.email, "talbertherndon1@gmail.com"],
            attachments: [uri]

        }).then((r) => {
            createProject(payload)
            navigation.navigate('Home');
            if (r.status != 'sent') {
                Alert.alert("No email was sent but project saved!", undefined, [])
            }
        }).catch((e) => {
            console.log(e);
            Alert.alert("Unable to send mail!", undefined, [])
            createProject(payload)
            navigation.navigate('Home');
        })


    }

    useEffect(() => {
        async function checkAvailability() {
            const isMailAvailable = await MailComposer.isAvailableAsync();
            setIsAvailable(isMailAvailable)
        }
        checkAvailability();
    }, [])

    // useEffect(() => {
    //     console.log("PARAMS:", params)
    //     if (!!params) {
    //         console.log("PARAMS:", params);
    //         setCustomerInformation({ name: params.name, address: params.address, city: params.city, state: params.state, zip: params.zip, phone: params.phone, email: params.email })
    //     }
    // }, [])

    return (
        <Layout style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} >
                <TabView swipeEnabled={false} style={{ flex: 1, paddingVertical: 10 }} selectedIndex={tab} onSelect={index => setTab(index)}>
                    <Tab title="Customer">
                        <CustomerInformation editing={editing} tab={tab} setCustomerInformation={setCustomerInformation} customerInformation={customerInformation} />
                    </Tab>
                    <Tab title="Job">
                        <JobInformation setJobInformation={setJobInformation} jobInformation={jobInformation} />
                    </Tab>
                    <Tab title="Scheduling">
                        <Scheduling tab={tab} setSchedulingInformation={setSchedulingInformation} schedulingInformation={schedulingInformation} />
                    </Tab>
                    <Tab title="Confirm">
                        <Confirmation cost={calculateTotal()} tab={tab} customerInformation={customerInformation} jobInformation={jobInformation} schedulingInformation={schedulingInformation} />
                    </Tab>
                </TabView>
                <View style={[styles.contiainer, { flexDirection: 'row', marginLeft: 'auto', marginTop: "auto" }]}>
                    {tab > 0 && <Button style={{ marginRight: 10 }} appearance="ghost" onPress={() => { setTab(tab - 1) }}>
                        Go back
                    </Button>}

                    {tab == 3 ?
                        <>
                            <Button onPress={downloadProject}>
                                Download
                            </Button>
                            <Button style={{ marginLeft: 10 }} onPress={editing ? editProjectHandler : addProjectHandler}>
                                {editing ? 'Re-Send' : 'Send'}
                            </Button>
                        </>
                        :
                        <Button onPress={() => { setTab(tab + 1) }} >
                            Next
                        </Button>
                    }
                </View>
                {calculateTotal() > 0 &&
                    <View style={[styles.shadow, styles.bottomTab, { backgroundColor: theme['background-basic-color-1'] }]}>
                        <View style={{ marginLeft: 'auto' }}>
                            <Text category="h3">Total: ${jobInformation.length > 0 ? calculateTotal() : 0}</Text>
                        </View>
                    </View>}
            </SafeAreaView>

        </Layout>
    );
}


const styles = StyleSheet.create({
    contiainer: {
        padding: 16,
        marginTop: 10,
    },
    tabContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    shadow: {
        shadowOffset: { width: 0, height: -15 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 15,
        shadowColor: '#171717'

    },
    bottomTab: {
        height: 75,
        width: '100%',
        padding: 16,
    }
});