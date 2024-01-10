import { Layout, Tab, TabView, Text, Button, useTheme, useStyleSheet, StyleService } from '@ui-kitten/components';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from 'react-native';
import CustomerInformation from '../components/sections/CustomerInformation';
import JobInformation from '../components/sections/JobInformation';
import Confirmation from '../components/sections/Confirmation';
import Scheduling from '../components/sections/Scheduling';
import { createProject } from '../../api';

export default function ProjectScreen({ route, navigation }) {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [customerInformation, setCustomerInformation] = useState();
    const [jobInformation, setJobInformation] = useState([]);
    const [schedulingInformation, setSchedulingInformation] = useState();


    function calculateTotal() {
        // setCost(jobInformation.reduce((total, item) => total + item.estimate, 0));
        return jobInformation.reduce((total, item) => total + item.estimate, 0)
    }

    function addProjectHandler() {
        const payload = { ...customerInformation, areas: jobInformation, ...schedulingInformation, cost: calculateTotal() }
        createProject(payload)
        navigation.navigate('Home');
    }

    return (
        <Layout style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} >
                <TabView swipeEnabled={false} style={{ flex: 1, paddingVertical: 10 }} selectedIndex={tab} onSelect={index => setTab(index)}>
                    <Tab title="Customer">
                        <CustomerInformation tab={tab} setCustomerInformation={setCustomerInformation} />
                    </Tab>
                    <Tab title="Job">
                        <JobInformation params={route.params} navigation={navigation.navigate} setJobInformation={setJobInformation} jobInformation={jobInformation} />
                    </Tab>
                    <Tab title="Scheduling">
                        <Scheduling tab={tab} setSchedulingInformation={setSchedulingInformation} schedulingInformation={schedulingInformation} />
                    </Tab>
                    <Tab title="Confirm">
                        <Confirmation tab={tab} customerInformation={customerInformation} jobInformation={jobInformation} schedulingInformation={schedulingInformation} />
                    </Tab>
                </TabView>
                <View style={[styles.contiainer, { flexDirection: 'row', marginLeft: 'auto', marginTop: "auto" }]}>
                    {tab > 0 && <Button style={{ marginRight: 10 }} appearance="ghost" onPress={() => { setTab(tab - 1) }}>
                        Go back
                    </Button>}

                    {tab == 3 ?
                        <Button onPress={addProjectHandler} >
                            Confirm
                        </Button>
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