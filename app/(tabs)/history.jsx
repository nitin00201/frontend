// app/history.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  Share,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// ---------- Helper Functions ----------
const getFileIcon = (type) => {
  switch (type) {
    case "image":
      return "image";
    case "video":
      return "videocam";
    case "pdf":
      return "document-text";
    default:
      return "document";
  }
};

const getFileIconColor = (type) => {
  switch (type) {
    case "image":
      return "#10B981";
    case "video":
      return "#F59E0B";
    case "pdf":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

// ---------- Filter Button Component ----------
const FilterButton = ({ item, selectedFilter, onPress }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      selectedFilter === item.key && styles.filterButtonActive,
    ]}
    onPress={() => onPress(item.key)}
  >
    <Ionicons
      name={item.icon}
      size={16}
      color={selectedFilter === item.key ? "#FFFFFF" : "#6B7280"}
    />
    <Text
      style={[
        styles.filterText,
        selectedFilter === item.key && styles.filterTextActive,
      ]}
    >
      {item.label}
    </Text>
  </TouchableOpacity>
);

// ---------- History Item Component ----------
const HistoryItem = ({ item, index, handleShare, handleDelete }) => {
  const [itemAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(itemAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.historyCard,
        {
          opacity: itemAnim,
          transform: [
            {
              translateY: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.fileInfo}>
          <View
            style={[
              styles.fileIconContainer,
              { backgroundColor: getFileIconColor(item.type) + "20" },
            ]}
          >
            <Ionicons
              name={getFileIcon(item.type)}
              size={24}
              color={getFileIconColor(item.type)}
            />
          </View>
          <View style={styles.fileDetails}>
            <Text style={styles.fileName} numberOfLines={1}>
              {item.originalName}
            </Text>
            <Text style={styles.fileSubtitle}>
              {item.date} • {item.time}
            </Text>
          </View>
        </View>
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsPercentage}>-{item.savings}</Text>
          <Text style={styles.savingsLabel}>saved</Text>
        </View>
      </View>

      {/* Size Comparison */}
      <View style={styles.sizeComparison}>
        <View style={styles.sizeBlock}>
          <Text style={styles.sizeLabel}>Original</Text>
          <Text style={styles.originalSize}>{item.originalSize}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={20} color="#6B7280" />
        </View>
        <View style={styles.sizeBlock}>
          <Text style={styles.sizeLabel}>Compressed</Text>
          <Text style={styles.compressedSize}>{item.compressedSize}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-outline" size={18} color="#2563EB" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Download", item.id)}
        >
          <Ionicons name="download-outline" size={18} color="#10B981" />
          <Text style={[styles.actionText, { color: "#10B981" }]}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={[styles.actionText, { color: "#EF4444" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ---------- Main Screen ----------
export default function HistoryScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [selectedFilter, setSelectedFilter] = useState("all");

  const historyData = [
    {
      id: "1",
      originalName: "summer_vacation.jpg",
      convertedName: "summer_vacation_compressed.jpg",
      originalSize: "5.2 MB",
      compressedSize: "1.1 MB",
      savings: "78%",
      date: "2025-08-31",
      time: "2:30 PM",
      type: "image",
      status: "completed",
    },
    {
      id: "2",
      originalName: "presentation.pdf",
      convertedName: "presentation_compressed.pdf",
      originalSize: "12.8 MB",
      compressedSize: "3.2 MB",
      savings: "75%",
      date: "2025-08-31",
      time: "1:15 PM",
      type: "pdf",
      status: "completed",
    },
    {
      id: "3",
      originalName: "birthday_video.mov",
      convertedName: "birthday_video.mp4",
      originalSize: "45.6 MB",
      compressedSize: "8.9 MB",
      savings: "80%",
      date: "2025-08-30",
      time: "5:45 PM",
      type: "video",
      status: "completed",
    },
  ];

  const filterOptions = [
    { key: "all", label: "All Files", icon: "documents-outline" },
    { key: "image", label: "Images", icon: "image-outline" },
    { key: "video", label: "Videos", icon: "videocam-outline" },
    { key: "pdf", label: "PDFs", icon: "document-text-outline" },
  ];

  const filteredData =
    selectedFilter === "all"
      ? historyData
      : historyData.filter((item) => item.type === selectedFilter);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `I compressed ${item.originalName} and saved ${item.savings}! From ${item.originalSize} to ${item.compressedSize}`,
        title: "File Compression Results",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDelete = (item) => {
    Alert.alert("Delete File", `Remove ${item.originalName}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => console.log("Delete", item.id) },
    ]);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No files processed yet</Text>
      <Text style={styles.emptySubtitle}>
        Start compressing files to see your history here
      </Text>
      <TouchableOpacity style={styles.emptyButton}>
        <LinearGradient colors={["#2563EB", "#3B82F6"]} style={styles.gradientButton}>
          <Text style={styles.emptyButtonText}>Compress Files</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Conversion History</Text>
          <Text style={styles.subtitle}>{filteredData.length} files processed</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <FlatList
            data={filterOptions}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <FilterButton
                item={item}
                selectedFilter={selectedFilter}
                onPress={setSelectedFilter}
              />
            )}
          />
        </View>

        {/* History */}
        {filteredData.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <HistoryItem
                item={item}
                index={index}
                handleShare={handleShare}
                handleDelete={handleDelete}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  filterContainer: {
    marginVertical: 20,
  },
  filterList: {
    paddingHorizontal: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  fileSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  savingsContainer: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  savingsPercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#059669',
  },
  savingsLabel: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 1,
  },
  sizeComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sizeBlock: {
    flex: 1,
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  originalSize: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  compressedSize: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  arrowContainer: {
    marginHorizontal: 16,
    padding: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});