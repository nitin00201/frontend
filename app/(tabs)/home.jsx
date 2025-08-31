// app/home.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  PanResponder,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import SettingsModal from '../components/SettingsModal';
import QuickActions from '../components/QuickActions';
import Heading from '../components/home/heading.jsx';

const { width, height } = Dimensions.get('window');

// Settings Modal Component with smooth animations


export default function HomeScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Main content animation
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

    // Staggered card animations
    const cardAnimations = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + (index * 150),
        useNativeDriver: true,
      })
    );

    Animated.sequence(cardAnimations).start();
  }, []);

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  const fileTypes = [
    {
      title: "Compress Images",
      subtitle: "Reduce image file sizes",
      icon: "image",
      color: "#10B981",
      bgColor: "#ECFDF5",
      borderColor: "#D1FAE5",
      onPress: () => console.log("Image compression"),
    },
    {
      title: "Compress Videos",
      subtitle: "Optimize for social media",
      icon: "videocam",
      color: "#F59E0B",
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
      onPress: () => console.log("Video compression"),
    },
    {
      title: "PDF Tools",
      subtitle: "Compress & merge PDFs",
      icon: "document-text",
      color: "#EF4444",
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
      onPress: () => console.log("PDF tools"),
    },
    {
      title: "Format Converter",
      subtitle: "Convert between formats",
      icon: "swap-horizontal",
      color: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
      onPress: () => console.log("Format conversion"),
    },
  ];

  const renderFeatureCard = (item, index) => {
    const cardAnim = cardAnims[index];
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.featureCard,
          {
            backgroundColor: item.bgColor,
            borderColor: item.borderColor,
          },
          {
            opacity: cardAnim,
            transform: [{
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }, {
              scale: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              })
            }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={32} color={item.color} />
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
          
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={20} color={item.color} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView>
        <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
       <Heading openSettings={openSettings}/>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>What would you like to compress?</Text>
          
          <View style={styles.cardsGrid}>
            {fileTypes.map((item, index) => renderFeatureCard(item, index))}
          </View>
        </View>

        {/* Quick Actions */}
       <QuickActions />

        {/* Recent Files Preview */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Files</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recentFile}>
              <View style={styles.recentFileIcon}>
                <Ionicons name="image" size={16} color="#10B981" />
              </View>
              <Text style={styles.recentFileName}>photo.jpg</Text>
              <Text style={styles.recentFileSavings}>-78%</Text>
            </View>
            
            <View style={styles.recentFile}>
              <View style={styles.recentFileIcon}>
                <Ionicons name="videocam" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.recentFileName}>video.mp4</Text>
              <Text style={styles.recentFileSavings}>-85%</Text>
            </View>
            
            <View style={styles.recentFile}>
              <View style={styles.recentFileIcon}>
                <Ionicons name="document-text" size={16} color="#EF4444" />
              </View>
              <Text style={styles.recentFileName}>report.pdf</Text>
              <Text style={styles.recentFileSavings}>-65%</Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      </ScrollView>
      <SettingsModal visible={settingsVisible} onClose={closeSettings} />
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
    marginBottom: 32,
  },


  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },

  actionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  cardsGrid: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardArrow: {
    marginLeft: 8,
  },
  quickActions: {
    marginBottom: 32,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  recentFile: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    minWidth: 80,
  },
  recentFileIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentFileName: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  recentFileSavings: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});