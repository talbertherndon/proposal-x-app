import { Button, Card, Icon, Layout, List, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { readProjects } from "../../api";
import ProjectCard from "../components/ProjectCard";


export default function HomeScreen({ route, navigation }) {
    const [projects, setProjects] = useState([])

    function refreshProjects() {
        readProjects().then((res) => {
            setProjects(res)
            console.log(projects);
        })
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshProjects();
        });
        return unsubscribe
    }, [navigation])



    return (
        <Layout style={styles.container}>
            <Text category='h5' style={{ marginBottom: 10 }}>Overview</Text>
            <Button style={{ margin: 10 }} onPress={() => navigation.navigate('Project')}>New Project</Button>
            <List data={projects} renderItem={(info) => <ProjectCard info={info} refreshProjects={refreshProjects} />} />

        </Layout>
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

