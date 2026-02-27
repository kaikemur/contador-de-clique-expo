import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions, 
  Platform,
  Animated,
  Vibration,
  Easing
} from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  const [contador, setContador] = useState(0);
  const [comboText, setComboText] = useState('');
  
  // Refs para lógica de Combo
  const clicksSeguidos = useRef(0);
  const comboTimer = useRef(null);

  // Valores Animados
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0.15)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const comboFloatAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de respiração do fundo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.2, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    // Rotação contínua do anel
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 10000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    return () => clearTimeout(comboTimer.current);
  }, []);

  // --- SISTEMA DE COMBOS ---
  const processarCombo = () => {
    clicksSeguidos.current += 1;
    const combo = clicksSeguidos.current;

    // Reseta o timer de combo (1.5 segundos para perder o combo)
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => {
      clicksSeguidos.current = 0;
      setComboText('');
    }, 1500);

    // Define a mensagem baseada na quantidade de cliques rápidos
    let novaMensagem = '';
    let vibracao = Platform.OS === 'ios' ? [0] : 15;

    if (combo === 3) novaMensagem = '⚡ COMBO x3';
    else if (combo === 5) novaMensagem = '🔥 RAMPAGE';
    else if (combo === 8) novaMensagem = '💀 UNSTOPPABLE';
    else if (combo === 10) novaMensagem = '🌌 QUANTUM SURGE';
    else if (combo >= 15 && combo % 5 === 0) novaMensagem = '👑 GODLIKE OVERLOAD 👑';

    // Dispara as animações se houver uma nova mensagem ou combo alto
    if (novaMensagem) {
      setComboText(novaMensagem);
      
      // Animação da mensagem flutuante
      comboFloatAnim.setValue(0);
      Animated.spring(comboFloatAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }

    // Efeito de "Tremor" para combos altos (Sobrecarga)
    if (combo >= 10) {
      vibracao = 40; // Vibração mais pesada
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true })
      ]).start();
    }

    Vibration.vibrate(vibracao);
  };

  const atualizarContador = (novoValor) => {
    processarCombo();
    setContador(novoValor);
    
    // Efeito de impacto no número
    scaleAnim.setValue(0.7);
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 150, useNativeDriver: true }).start();
  };

  const incrementar = () => atualizarContador(contador + 1);
  const decrementar = () => atualizarContador(contador - 1);
  const restart = () => {
    Vibration.vibrate(100);
    clicksSeguidos.current = 0;
    setComboText('');
    setContador(0);
    
    // Efeito de desligamento (shake forte e encolhimento)
    scaleAnim.setValue(1.5);
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  };

  const obterEstiloDinamico = () => {
    if (contador > 0) return { color: '#00F0FF', bgGlow: '#00F0FF', isOverload: clicksSeguidos.current >= 10 };
    if (contador < 0) return { color: '#FF003C', bgGlow: '#FF003C', isOverload: clicksSeguidos.current >= 10 };
    return { color: '#FFFFFF', bgGlow: '#FFFFFF', isOverload: false };
  };

  const tema = obterEstiloDinamico();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Neon com Sobrecarga */}
      <Animated.View style={[
        styles.glowOrb, 
        { 
          backgroundColor: tema.bgGlow, 
          opacity: tema.isOverload ? 0.6 : pulseAnim, // Brilho intenso no overload
          transform: [
            { scale: pulseAnim.interpolate({ inputRange: [0.2, 0.5], outputRange: [1, 1.8] }) }
          ]
        }
      ]} />
      
      {/* Anel Orbital */}
      {contador !== 0 && (
        <Animated.View style={[
            styles.rotatingRing, 
            { 
              borderColor: tema.color,
              transform: [
                { rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
                { scale: tema.isOverload ? 1.1 : 1 } // Expande no overload
              ] 
            }
        ]} />
      )}

      <View style={styles.content}>
        
        {/* Espaço reservado para o texto de Combo */}
        <View style={styles.comboContainer}>
          {comboText ? (
            <Animated.Text style={[
              styles.comboText, 
              { 
                color: tema.color,
                opacity: comboFloatAnim.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 1, 0] }),
                transform: [
                  { translateY: comboFloatAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] }) },
                  { scale: comboFloatAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.2, 1] }) }
                ]
              }
            ]}>
              {comboText}
            </Animated.Text>
          ) : null}
        </View>

        {/* Display Central com Efeito Shake */}
        <Animated.View style={[
          styles.displayContainer,
          { transform: [{ translateX: shakeAnim }] } // Aplica o tremor aqui
        ]}>
          <View style={[styles.glassCard, tema.isOverload && { borderColor: tema.color, borderWidth: 3 }]}>
            <View style={styles.glassShineTop} />
            
            <Animated.Text style={[
              styles.numero, 
              { 
                color: tema.color, 
                textShadowColor: tema.color,
                textShadowRadius: tema.isOverload ? 30 : 15, // Brilho extra no texto
                transform: [{ scale: scaleAnim }]
              }
            ]}>
              {contador}
            </Animated.Text>
            
            <View style={styles.glassShineBottom} />
          </View>
        </Animated.View>

        {/* Painel de Controle */}
        <View style={styles.controlPanel}>
          <View style={styles.mainControls}>
            <TouchableOpacity style={[styles.botaoPrincipal, styles.botaoMenos]} onPress={decrementar} activeOpacity={0.5}>
              <Feather name="minus" size={40} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSecundario} onPress={restart} activeOpacity={0.5}>
              <MaterialCommunityIcons name="power" size={30} color="#E2E8F0" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.botaoPrincipal, styles.botaoMais]} onPress={incrementar} activeOpacity={0.5}>
              <Feather name="plus" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030509', // Fundo abissal para destacar o Neon
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
  },
  glowOrb: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    filter: 'blur(60px)',
  },
  rotatingRing: {
    position: 'absolute',
    width: width * 0.88,
    height: width * 0.88,
    borderRadius: width * 0.44,
    borderWidth: 2,
    borderStyle: 'dotted',
    opacity: 0.4,
  },
  comboContainer: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  comboText: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  displayContainer: {
    width: width * 0.75,
    height: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(10, 15, 30, 0.65)',
    borderRadius: width * 0.375,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  glassShineTop: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
  },
  glassShineBottom: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: '10%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  numero: {
    fontSize: 130,
    fontWeight: '200',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-thin',
  },
  controlPanel: {
    marginTop: 60,
    alignItems: 'center',
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  botaoPrincipal: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  botaoMais: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
  },
  botaoMenos: {
    backgroundColor: '#FF003C',
    shadowColor: '#FF003C',
  },
  botaoSecundario: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});