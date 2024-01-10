import { Card, Icon, List, Text } from "@ui-kitten/components";
import { StyleSheet, View, TouchableWithoutFeedback, Linking } from "react-native";
import { deleteProject, readAreas, readAreasByProjects } from "../../api";
import { useEffect, useState } from "react";
import { Image } from "expo-image";


const renderItemHeader = (headerProps, info) => {
    const fullAddress = `${info.item.address}, ${info.item.city} ${info.item.state} ${info.item.zip}`
    const url = Platform.select({
        ios: `maps:0,0?q=${fullAddress}`,
        android: `geo:0,0?q=${fullAddress}`,
    })
    return (
        <View style={{ padding: 10 }} >
            <TouchableWithoutFeedback onPress={() => { Linking.openURL(url) }} {...headerProps}>
                <Text category='h6'>
                    {fullAddress}
                </Text>
            </TouchableWithoutFeedback>
        </View>
    )
};

const renderItemFooter = (footerProps, info, refreshProjects) => (
    <View style={styles.footer}>
        <TouchableWithoutFeedback onPress={() => { deleteProject(info.item.id); refreshProjects(); }} {...footerProps}>
            <Icon fill='#8F9BB3' style={{ width: 30, height: 30, marginLeft: 'auto' }} name="trash-2" />
        </TouchableWithoutFeedback>
    </View>
);


const renderItem = ({ item }) => (
    <View>
        <Image style={{ width: 75, height: 75 }} source={item.source} />
    </View>
)


export default function ProjectCard({ info, refreshProjects }) {
    const [areas, setAreas] = useState([])

    useEffect(() => {
        readAreasByProjects(info.item.id).then((res) => {
            console.log(res)
            setAreas(res)
        })
    }, [])

    return (
        <Card
            style={styles.item}
            status='basic'
            header={headerProps => renderItemHeader(headerProps, info)}
            footer={footerProps => renderItemFooter(footerProps, info, refreshProjects)}
        >
            <Text>Contact Name: {info.item.name}</Text>
            <Text>Contact Email: {info.item.email}</Text>
            <Text>Contact Phone Number: {info.item.phone}</Text>

            <Text>Current Cost: ${info.item.cost}</Text>
            <Text>Number of Areas: {areas.length}</Text>
            <View style={{marginVertical:5, flexDirection:'column'}}>
                <List data={areas} renderItem={renderItem} />
            </View>
        </Card>
    )
}


const styles = StyleSheet.create({
    footer: {
        padding: 10
    }

})