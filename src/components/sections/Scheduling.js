import { Card, Datepicker, Icon, Input, Layout, List, ListItem, Text, Button } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";
import { Image } from 'expo-image';
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";



export default function Scheduling({ tab, setSchedulingInformation }) {
    const [startDate, setStartDate] = useState()
    const [finishDate, setFinishDate] = useState()
    const [comment, setComment] = useState('')

    useEffect(() => {
        const payload = {
            startDate,
            finishDate,
            comment
        }
        setSchedulingInformation(payload)

    }, [tab])

    return (
        <>
            <KeyboardAwareScrollView>
                <Layout style={styles.contiainer}>
                    <Text category='h5' style={{ marginBottom: 10 }}>Project Timeline</Text>
                    <Datepicker
                        style={styles.input}
                        label="Start Date"
                        placeholder="Pick Date"
                        date={startDate}
                        onSelect={nextDate => setStartDate(nextDate)}
                        accessoryRight={<Icon name='calendar' />}
                    />

                    <Datepicker
                        style={styles.input}
                        label="Finish Date"
                        placeholder="Pick Date"
                        date={finishDate}
                        onSelect={nextDate => setFinishDate(nextDate)}
                        accessoryRight={<Icon name='calendar' />}
                    />

                    <Input
                        style={styles.input}
                        multiline={true}
                        textStyle={{ minHeight: 132 }}
                        label={"Customer Notes"}
                        value={comment}
                        onChangeText={(e) => { setComment(e) }}
                    />

                </Layout>
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    contiainer: {
        padding: 16,
        marginTop: 10,
    },
    input: {
        marginTop: 20
    },

})