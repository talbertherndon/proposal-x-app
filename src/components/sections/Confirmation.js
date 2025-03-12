import {
    Card,
    Layout,
    List,
    ListItem,
    Text,
    Button,
    Divider,
    CheckBox,
    Modal,
} from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TermsModal from "../modals/TermsModal";
import { areas } from "../../mock/areas";

const renderItem = ({ item, index }) => {
    let requirements = typeof item.requirements === 'string' ? JSON.parse(item.requirements) : item.requirements;
    let photo = typeof item.source === 'string' ? item?.source.includes('file') ? item.source : areas.find((area) => area.file === item.source) : areas.find((area) => area.file === item.file);
    return (
        <>
            <ListItem
                style={{ marginHorizontal: -5 }}
                accessoryLeft={(props) => (
                    <Image
                        style={{ width: 75, height: 75, borderRadius: 5 }}
                        source={!!photo?.source ? photo.source : photo}
                    />
                )}
                title={(props) => (
                    <Text style={{ marginHorizontal: 10, fontSize: 18, fontWeight: 500 }}>
                        {item.name}
                    </Text>
                )}
                description={(des) => (
                    <View style={{ marginHorizontal: 10 }}>
                        <Text category="c1">
                            {requirements.map((require) => require.name).join(", ")}
                        </Text>
                        <Text category="c2">${item.estimate.toFixed(2)}</Text>
                    </View>
                )}
            />
        </>
    );
};

// const renderItemService = ({ item, index }) => {
//     let requirements = typeof item.requirements === 'string' ? JSON.parse(item.requirements) : item.requirements;
//     let photo = typeof item.source === 'string' ? item?.source.includes('file') ? item.source : areas.find((area) => area.file === item.source) : areas.find((area) => area.file === item.file);
//     return (
//         <>
//             <ListItem
//                 style={{ marginHorizontal: -5 }}
//                 accessoryLeft={(props) => (
//                     <Image
//                         style={{ width: 75, height: 75, borderRadius: 5 }}
//                         source={!!photo?.source ? photo.source : photo}
//                     />
//                 )}
//                 title={(props) => (
//                     <Text style={{ marginHorizontal: 10, fontSize: 18, fontWeight: 500 }}>
//                         {item.name}
//                     </Text>
//                 )}
//                 description={(des) => (
//                     <View style={{ marginHorizontal: 10 }}>
//                         <Text category="c1">
//                             {requirements.map((require) => require.name).join(", ")}
//                         </Text>
//                         <Text category="c2">${item.estimate.toFixed(2)}</Text>
//                     </View>
//                 )}
//             />
//         </>
//     );
// };

export default function Confirmation({
    jobInformation,
    customerInformation,
    schedulingInformation,
    cost,
    fullServiceCheck
}) {
    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState(false);

    return (
        <KeyboardAwareScrollView>
            <Layout style={{ padding: 10 }}>
                {customerInformation?.name && (
                    <Card
                        style={styles.cardContainer}
                        header={(props) => (
                            <View style={styles.cardHeader}>
                                <Text category="h6">Customer Information</Text>
                            </View>
                        )}
                    >
                        <Text category="s1">Name: {customerInformation.name}</Text>
                        <Text category="s1">
                            Address: {customerInformation.address} {customerInformation.city},{" "}
                            {customerInformation.state} {customerInformation.zip}
                        </Text>
                        <Text category="s1">Phone: {customerInformation.phone}</Text>
                        <Text category="s1">Email: {customerInformation.email}</Text>
                    </Card>
                )}
                {jobInformation.length > 0 && (
                    <Card
                        style={styles.cardContainer}
                        header={(props) => (
                            <View style={styles.cardHeader}>
                                <Text category="h6">Job Information </Text>
                            </View>
                        )}
                    >
                        <List data={jobInformation} renderItem={renderItem} />
                        <Text>{fullServiceCheck.join(' - ')}</Text>
                    </Card>
                )}

                {schedulingInformation?.start && (
                    <Card
                        style={styles.cardContainer}
                        header={(props) => {
                            return (
                                <View style={styles.cardHeader}>
                                    <Text category="h6">Scheduling Information</Text>
                                </View>
                            );
                        }}
                    >
                        <Text category="s1">Start Date: {schedulingInformation.start}</Text>
                        <Text category="s1">
                            Finish Date: {schedulingInformation.finish}
                        </Text>
                        <Divider style={{ marginVertical: 10 }} />
                        <Text>{schedulingInformation.comment}</Text>
                    </Card>
                )}
                <Card style={styles.cardContainer}>
                    <Text category="c1">
                        All the aforementioned tasks will be carried out in a substantial
                        and skillful manner, adhering to the terms and conditions and
                        detailed job information outlined above. The specified total cost
                        for this work will be paid with payments to be made as described
                        below:{" "}
                    </Text>
                    <View style={{ marginVertical: 10 }}>
                        <Text> Due on Acceptance (20%): </Text>
                        <Text category="h5">${(cost * 0.2).toFixed(2)}</Text>
                        <Text> Due on Start Date (30%): </Text>
                        <Text category="h5">${(cost * 0.3).toFixed(2)}</Text>
                        <Text> Due on Completion (50%):</Text>
                        <Text category="h5">${(cost - (cost * 0.2 + cost * 0.3)).toFixed(2)}</Text>
                    </View>
                </Card>

                <View
                    style={{
                        flexDirection: "row-reverse",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        size="small"
                        onPress={() => {
                            setVisible(true);
                        }}
                    >
                        View
                    </Button>
                    <CheckBox
                        checked={confirm}
                        onChange={() => {
                            setConfirm(!confirm);
                        }}
                        style={{ marginTop: 10 }}
                    >
                        Accept All <Text status="info">Terms and Conditions</Text>
                    </CheckBox>
                </View>
                <Modal
                    visible={visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => setVisible(false)}
                >
                    <TermsModal setVisible={setVisible} />
                </Modal>
            </Layout>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    input: {
        marginTop: 10,
    },
    cardContainer: {
        margin: 10,
    },
    cardHeader: {
        padding: 10,
    },
});
