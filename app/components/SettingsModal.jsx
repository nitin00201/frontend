import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');


export default SettingsModal = ({ visible, onClose }) => {
  const modalAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  
  // State for settings
  const [imageQuality, setImageQuality] = useState('85');
  const [videoQuality, setVideoQuality] = useState('720p');
  const [pdfCompression, setPdfCompression] = useState('Medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSavePath, setAutoSavePath] = useState('Downloads');
  
  // Dropdown states
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [showVideoDropdown, setShowVideoDropdown] = useState(false);
  const [showPdfDropdown, setShowPdfDropdown] = useState(false);
  const [showAutoSaveDropdown, setShowAutoSaveDropdown] = useState(false);

  // Dropdown options
  const imageQualityOptions = ['60% (Small)', '75% (Good)', '85% (Recommended)', '95% (High)'];
  const videoQualityOptions = ['480p (Small)', '720p (HD)', '1080p (Full HD)', '4K (Ultra)'];
  const pdfCompressionOptions = ['Low (Faster)', 'Medium (Balanced)', 'High (Smaller)'];
  const autoSaveOptions = ['Downloads', 'Documents', 'Photos', 'Custom Folder'];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Reset dropdown states when modal closes
      setShowImageDropdown(false);
      setShowVideoDropdown(false);
      setShowPdfDropdown(false);
      setShowAutoSaveDropdown(false);
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 150) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const navigateToUpgrade = () => {
    onClose();
    // Navigate to upgrade page - you'll need to implement navigation
    console.log('Navigate to upgrade page');
  };

  const renderDropdown = (options, selectedValue, onSelect, isVisible) => {
    if (!isVisible) return null;
    
    return (
      <Animated.View style={styles.dropdown}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dropdownItem,
              selectedValue === option && styles.dropdownItemSelected
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.dropdownText,
              selectedValue === option && styles.dropdownTextSelected
            ]}>
              {option}
            </Text>
            {selectedValue === option && (
              <Ionicons name="checkmark" size={18} color="#2563EB" />
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  const renderToggleSwitch = (isEnabled, onToggle) => (
    <TouchableOpacity onPress={onToggle} style={styles.toggleContainer}>
      <Animated.View style={[
        styles.toggleSwitch,
        { backgroundColor: isEnabled ? '#2563EB' : '#D1D5DB' }
      ]}>
        <Animated.View style={[
          styles.toggleKnob,
          { 
            transform: [{ 
              translateX: isEnabled ? 16 : 0 
            }] 
          }
        ]} />
      </Animated.View>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View 
        style={[
          styles.modalBackdrop,
          { opacity: backdropAnim }
        ]}
      >
        <TouchableOpacity 
          style={styles.backdropTouch} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.modalHandle} />
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Processing Defaults</Text>
              
              {/* Image Quality with Dropdown */}
              <View>
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    setShowImageDropdown(!showImageDropdown);
                    setShowVideoDropdown(false);
                    setShowPdfDropdown(false);
                    setShowAutoSaveDropdown(false);
                  }}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name="image-outline" size={24} color="#2563EB" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Image Quality</Text>
                      <Text style={styles.settingValue}>{imageQuality}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={showImageDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
                {renderDropdown(
                  imageQualityOptions, 
                  imageQuality, 
                  (value) => {
                    setImageQuality(value);
                    setShowImageDropdown(false);
                  }, 
                  showImageDropdown
                )}
              </View>

              {/* Video Quality with Dropdown */}
              <View>
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    setShowVideoDropdown(!showVideoDropdown);
                    setShowImageDropdown(false);
                    setShowPdfDropdown(false);
                    setShowAutoSaveDropdown(false);
                  }}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name="videocam-outline" size={24} color="#F59E0B" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Video Quality</Text>
                      <Text style={styles.settingValue}>{videoQuality}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={showVideoDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
                {renderDropdown(
                  videoQualityOptions, 
                  videoQuality, 
                  (value) => {
                    setVideoQuality(value);
                    setShowVideoDropdown(false);
                  }, 
                  showVideoDropdown
                )}
              </View>

              {/* PDF Compression with Dropdown */}
              <View>
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    setShowPdfDropdown(!showPdfDropdown);
                    setShowImageDropdown(false);
                    setShowVideoDropdown(false);
                    setShowAutoSaveDropdown(false);
                  }}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name="document-text-outline" size={24} color="#EF4444" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>PDF Compression</Text>
                      <Text style={styles.settingValue}>{pdfCompression}</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={showPdfDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
                {renderDropdown(
                  pdfCompressionOptions, 
                  pdfCompression, 
                  (value) => {
                    setPdfCompression(value);
                    setShowPdfDropdown(false);
                  }, 
                  showPdfDropdown
                )}
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>App Preferences</Text>
              
              {/* Notifications with Toggle */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="notifications-outline" size={24} color="#8B5CF6" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Notifications</Text>
                    <Text style={styles.settingValue}>
                      {notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </Text>
                  </View>
                </View>
                {renderToggleSwitch(notificationsEnabled, toggleNotifications)}
              </View>

              {/* Auto Save with Dropdown */}
              <View>
                <TouchableOpacity 
                  style={styles.settingItem}
                  onPress={() => {
                    setShowAutoSaveDropdown(!showAutoSaveDropdown);
                    setShowImageDropdown(false);
                    setShowVideoDropdown(false);
                    setShowPdfDropdown(false);
                  }}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name="download-outline" size={24} color="#10B981" />
                    <View style={styles.settingText}>
                      <Text style={styles.settingLabel}>Auto Save Location</Text>
                      <Text style={styles.settingValue}>{autoSavePath} folder</Text>
                    </View>
                  </View>
                  <Ionicons 
                    name={showAutoSaveDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
                {renderDropdown(
                  autoSaveOptions, 
                  autoSavePath, 
                  (value) => {
                    setAutoSavePath(value);
                    setShowAutoSaveDropdown(false);
                  }, 
                  showAutoSaveDropdown
                )}
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Account</Text>
              
              {/* Upgrade to Premium - Navigation */}
              <TouchableOpacity 
                style={[styles.settingItem, styles.upgradeItem]}
                onPress={navigateToUpgrade}
              >
                <View style={styles.settingInfo}>
                  <LinearGradient
                    colors={['#F59E0B', '#F97316']}
                    style={styles.upgradeIconContainer}
                  >
                    <Ionicons name="star" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Upgrade to Premium</Text>
                    <Text style={styles.upgradeValue}>Unlimited processing & more</Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#F59E0B" />
              </TouchableOpacity>
            </View>

            {/* Additional Settings */}
            <View style={styles.settingSection}>
              <Text style={styles.sectionTitle}>Support</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Help & FAQ</Text>
                    <Text style={styles.settingValue}>Get support</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="shield-outline" size={24} color="#6B7280" />
                  <View style={styles.settingText}>
                    <Text style={styles.settingLabel}>Privacy Policy</Text>
                    <Text style={styles.settingValue}>View terms</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

 
  quickButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  settingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingValue: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  // Dropdown Styles
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  dropdownText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  
  // Toggle Switch Styles
  toggleContainer: {
    padding: 4,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Upgrade Item Styles
  upgradeItem: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1,
  },
  upgradeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeValue: {
    fontSize: 13,
    color: '#F59E0B',
    marginTop: 2,
    fontWeight: '600',
  },
});