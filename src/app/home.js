import { Button, Card, Icon, Layout, List, TabView, Text, useTheme, Tab } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { deleteProject, readProjects } from "../../api";
import ProjectCard from "../components/ProjectCard";
import { shareAsync } from "expo-sharing";
import { generatePdf } from "../utils/generate-pdf";


export default function HomeScreen({ route, navigation }) {
    const [projects, setProjects] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(1);

    const theme = useTheme()

    function editProject(info) {
        console.log("Editing Project...")
        console.log(info);
        navigation.navigate("Project", info)
    }
    function removeProject(info) {
        console.log("Deleting Project...")
        deleteProject(info.item.id)
        refreshProjects();
    }
    async function createAttachment(project, areas) {
        console.log("Creating Attachment...")
        const uri = await generatePdf({ ...project.item, areas: areas }, areas, false);
        shareAsync(uri)
    }

    function refreshProjects() {
        setRefreshing(true)
        readProjects().then((res) => {
            setProjects(res)
            console.log(projects);
            setRefreshing(false)
        }).catch((e) => {
            setRefreshing(false)
            console.log(e)
            //Alert.alert("There was an issue loading your projects!")
        })
    }
    function parseDate(dateStr) {
        console.log("DATL:", dateStr)
        const parts = dateStr.split('/');
        console.log("DATES", parts)
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    function isPastDue(dueDateStr) {
        if (dueDateStr) {
            const today = new Date();
            const dueDate = parseDate(dueDateStr);
            // Calculate the time difference in milliseconds
            const timeDiff = dueDate.getTime() - today.getTime();
            // Convert time difference from milliseconds to days
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (daysDiff < 0) return true
        }

        return false
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshProjects();
        });
        return unsubscribe
    }, [navigation])



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme['background-basic-color-1'] }}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshProjects} />} style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text category='h1' style={{ marginBottom: 10, marginRight: 'auto' }}>Projects</Text>
                    <Button size="small" style={{ marginLeft: 'auto', margin: 10 }} accessoryLeft={() => (<Icon fill='white' style={{ width: 25, height: 25, marginLeft: 'auto' }} name="plus-circle-outline" />
                    )} onPress={() => navigation.navigate('Project')}>New Project</Button>

                </View>
                <TabView onSelect={index => { setSelectedIndex(index) }} selectedIndex={selectedIndex} swipeEnabled={false} style={{ flex: 1, paddingVertical: 10 }}>
                    <Tab title="Past Due">
                        <List style={{ backgroundColor: 'white' }} data={projects} renderItem={(info) => { if (isPastDue(info.item.finish)) return (<ProjectCard info={info} refreshProjects={refreshProjects} createAttachment={createAttachment} removeProject={removeProject} editProject={editProject} />) }} />
                    </Tab>
                    <Tab title="Upcoming">
                        <List style={{ backgroundColor: 'white' }} data={projects} renderItem={(info) => { if (!isPastDue(info.item.finish)) return (<ProjectCard info={info} refreshProjects={refreshProjects} createAttachment={createAttachment} removeProject={removeProject} editProject={editProject} />) }} />
                    </Tab>
                    <Tab title="Completed">
                    </Tab>
                </TabView>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    },
    card_container: {
        width: '50%',
        height: 175,
        justifyContent: "center",
        flex: 1,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#8F9BB3',
        borderRadius: 10,
        margin: 5

    }
})

