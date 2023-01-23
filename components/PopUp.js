import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

export const PopUpType1 = ({
  modalVisible,
  modalHandler,
  action,
  askValue,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          modalHandler(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.askView}>
              <Text style={styles.askText}>{askValue}</Text>
            </View>
            <View style={styles.buttonView}>
              <Pressable
                style={{
                  marginTop: 8,
                  ...styles.button,
                  ...styles.buttonClose,
                }}
                onPress={() => modalHandler(!modalVisible)}
              >
                <Text style={styles.modalText}>취소</Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 8,
                  ...styles.button,
                  ...styles.buttonClose,
                }}
                onPress={() => {
                  modalHandler(!modalVisible);
                  action();
                }}
              >
                <Text style={styles.modalText}>삭제 </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    width: 344,
    height: 112,
  },
  askView: {
    marginTop: 16,
    width: 312,
    height: 48,
    alignItems: "center",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    height: 48,
  },
  button: {
    width: 128,
    height: 24,
  },
  buttonOpen: {
    backgroundColor: "#FFFFFF",
  },
  buttonClose: {
    backgroundColor: "#FFFFFF",
  },
  askText: {
    width: 312,
    height: 16,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 0,
    letterSpacing: -0.5,
    fontWeight: "400",
    textAlign: "center",
  },
  modalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 1.2,
    alignSelf: "center",
    fontWeight: "700",
  },
});
