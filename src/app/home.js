import { Button, Icon, Layout, Text } from "@ui-kitten/components";
import { FlatList, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const EmptyItem = () => {
    return (
        <View style={styles.card_container}>
            <Text style={{ fontColor: 'red' }}>New Proposal</Text>
            <Icon style={{ width: 32, height: 32 }} name="plus-outline" fill='#8F9BB3' />
        </View>
    )
}
export default function HomeScreen({ route, navigation }) {

    return (
        <Layout style={styles.container}>
            <Text category='h5' style={{ marginBottom: 10 }}>Overview</Text>
            <Button style={{ margin: 10 }} onPress={() => navigation.navigate('Project')}>New Project</Button>
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex:1
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

