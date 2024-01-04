import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Input, Layout, Text, Modal, List, ListItem } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import NewAreaModal from "../modals/NewAreaModal";
import { Image } from "expo-image";


export default function JobInformation({ setJobInformation, jobInformation }) {
    const [visible, setVisible] = useState(false);
    const [editMode, setEditMode] = useState()


    function addAreaHandler(room) {

        setJobInformation([room, ...jobInformation])
        setVisible(false);
    }


    function editAreaHandler(room) {
        const newItems = [...jobInformation];
        newItems[room.index] = room
        setJobInformation(newItems)
        setVisible(false);

    }


    const renderItem = ({ item, index }) => {
        return (
            <>
                <ListItem onPress={() => { setEditMode({ ...item, index }); setVisible(true); }} accessoryRight={(props) => (<Button onPress={() => { const newItems = [...jobInformation]; newItems.splice(index, 1); setJobInformation(newItems) }} size="tiny">Delete</Button>)}
                    accessoryLeft={(props) => (<Image style={{ width: 75, height: 75, borderRadius: 5 }} source={item.source} />)} title={props => <Text style={{ marginHorizontal: 10, fontSize: 18, fontWeight: 500 }}>{item.name}</Text>} description={des => <View style={{ marginHorizontal: 10 }}><Text category="c1">{item.requirements.join(', ')}</Text><Text category="c2">${item.estimate}</Text></View>} />
            </>
        )
    }

    return (
        <>
            <Layout style={styles.container}>
                <Text category='h5' style={{ marginBottom: 10 }}>Area Details</Text>
                <Text category='body' style={{ marginBottom: 10 }}>Please choose all areas where work is required for the clients project.</Text>
                <Button onPress={() => { setVisible(true); setEditMode(); }} style={{ marginRight: 'auto' }}>Add Areas</Button>

                <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={() => setVisible(false)}>
                    <NewAreaModal setVisible={setVisible} addAreaHandler={addAreaHandler} editAreaHandler={editAreaHandler} editMode={editMode} />
                </Modal>

                <List style={{ backgroundColor: 'white' }} data={jobInformation} renderItem={renderItem} />
            </Layout>

        </>
    )
}



const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginTop: 10,
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        marginTop: 10,
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 30
    },
    bottomTab: {
        backgroundColor: 'white',
        height: 75,
        width: '100%',
        padding: 16
    }
});