import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

export const PopUpType1 = ({
  modalVisible,
  modalHandler,
  action,
  askValue,
  actionValue,
}) => {
  return modalVisible ? (
    <View style={{ flex: 1 }}>
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
                <Text style={styles.modalText}>{actionValue} </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    <></>
  );
};

export const PopUpType2 = ({
  modalVisible,
  modalHandler,
  action1,
  action2,
  askValue,
  actionValue1,
  actionValue2,
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
                  action1();
                }}
              >
                <Text style={styles.modalText}>{actionValue1} </Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 8,
                  ...styles.button,
                  ...styles.buttonClose,
                }}
                onPress={() => {
                  modalHandler(!modalVisible);
                  action2();
                }}
              >
                <Text style={styles.modalText}>{actionValue2} </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
//PopUpType3는 AddFirendModal로 대체함
export const PopUpType4 = ({
  modalVisible,
  modalHandler,
  action1,
  action2,
  action3,
  askValue,
  actionValue1,
  actionValue2,
  actionValue3,
}) => {
  return modalVisible ? (
    <View
      style={{ ...styles.centeredView }}
      onTouchEnd={() => modalHandler(!modalVisible)}
    >
      <Modal
        animationType="none"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          modalHandler(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.popup4modalView}>
            <View
              style={{
                marginTop: 0,
                width: 312,
                height: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  width: 312,
                  height: 16,
                  marginTop: 24,
                  fontSize: 16,
                  lineHeight: 16,
                  letterSpacing: -0.5,
                  fontFamily: "NotoSansKR-Medium",
                  fontWeight: "500",
                }}
              >
                {askValue}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: 312,
                height: 48,
                marginTop: 48,
              }}
            >
              <Pressable
                style={{
                  marginTop: 0,
                  width: "100%",
                  height: 16,
                }}
                onPress={() => {
                  modalHandler(!modalVisible);
                  action1();
                }}
              >
                <Text style={styles.popup4Text}>{actionValue1} </Text>
              </Pressable>
              <Pressable
                style={{
                  marginTop: 8,
                  width: "100%",
                  height: 16,
                }}
                onPress={() => {
                  modalHandler(!modalVisible);
                  action2();
                }}
              >
                <Text style={styles.popup4Text}>{actionValue2} </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    <View></View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    borderColor: "#DDDFE9",
    borderWidth: 1,
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
    width: 104,
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
    textAlign: "center",
    fontFamily: "NotoSansKR-Medium",
  },
  modalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 1.2,
    alignSelf: "center",
    fontWeight: "700",
    fontFamily: "NotoSansKR-Bold",
  },
  popup4Text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 1.2,
    fontWeight: "400",
    fontFamily: "NotoSansKR-Regular",
  },
  popup4modalView: {
    borderColor: "#DDDFE9",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    width: 344,
    height: 136,
  },
});
