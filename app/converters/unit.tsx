import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Input } from "../../components/ui/Input";
import { ResultDisplay } from "../../components/ui/ResultDisplay";
import { Colors } from "../../constants/colors";
import { Theme } from "../../constants/theme";
import {
  UNIT_CATEGORIES,
  UnitCategory,
  getUnitsForCategory,
  convert,
  formatResult,
} from "../../utils/unitConversions";

export default function UnitConverterScreen() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [inputValue, setInputValue] = useState("");

  const units = getUnitsForCategory(category);
  const result =
    inputValue && !isNaN(parseFloat(inputValue))
      ? formatResult(
          convert(parseFloat(inputValue), fromUnit, toUnit, category),
        )
      : "";

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const u = getUnitsForCategory(cat);
    setFromUnit(u[0].value);
    setToUnit(u[1]?.value || u[0].value);
    setInputValue("");
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.title}>Unit Converter</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category selector */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pills}>
          {UNIT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[styles.pill, category === cat.value && styles.pillActive]}
              onPress={() => handleCategoryChange(cat.value)}
            >
              <Text
                style={[
                  styles.pillText,
                  category === cat.value && styles.pillTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input */}
        <Input
          label="Value"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Enter value"
          keyboardType="numeric"
        />

        {/* From / To pickers */}
        <View style={styles.row}>
          <View style={styles.pickerBox}>
            <Text style={styles.label}>From</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={fromUnit}
                onValueChange={setFromUnit}
                style={styles.pickerInner}
              >
                {units.map((u) => (
                  <Picker.Item key={u.value} label={u.label} value={u.value} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.swapBtn} onPress={swapUnits}>
            <Ionicons name="swap-horizontal" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>

          <View style={styles.pickerBox}>
            <Text style={styles.label}>To</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={toUnit}
                onValueChange={setToUnit}
                style={styles.pickerInner}
              >
                {units.map((u) => (
                  <Picker.Item key={u.value} label={u.label} value={u.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {result !== "" && (
          <ResultDisplay
            label="Result"
            value={`${result} ${toUnit}`}
            copyable
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.SURFACE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER,
  },
  title: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.TEXT_PRIMARY,
  },
  content: { padding: Theme.spacing.lg, paddingBottom: 40 },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Theme.spacing.xs,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.SURFACE,
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
  },
  pillActive: { backgroundColor: Colors.PRIMARY, borderColor: Colors.PRIMARY },
  pillText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.TEXT_SECONDARY,
    fontWeight: Theme.fontWeight.medium,
  },
  pillTextActive: { color: Colors.SURFACE },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  pickerBox: { flex: 1 },
  picker: {
    borderWidth: 1.5,
    borderColor: Colors.BORDER,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.SURFACE,
    overflow: "hidden",
  },
  pickerInner: { height: 50, color: Colors.TEXT_PRIMARY },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
