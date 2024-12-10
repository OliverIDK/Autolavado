import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { DataTable, ActivityIndicator, Text, Divider } from 'react-native-paper';
import { database } from '../src/config/fb';
import { collection, getDocs } from 'firebase/firestore';

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ReporteF = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((dayOfWeek) % 7));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);
        if (dayOfWeek === 0) {
          endOfWeek.setDate(now.getDate());
          endOfWeek.setHours(23, 59, 59, 999);
        }
        const startISO = startOfWeek.toISOString();
        const endISO = endOfWeek.toISOString();
        const querySnapshot = await getDocs(collection(database, 'RegistroServicios'));
        const servicios = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(item => item.fecha >= startISO && item.fecha <= endISO);
        const groupedData = servicios.reduce((acc, item) => {
          const fecha = new Date(item.fecha);
          const dia = diasSemana[fecha.getDay()];
          if (!acc[dia]) {
            acc[dia] = [];
          }
          acc[dia].push(item);
          return acc;
        }, {});

        setData(groupedData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const totalSemana = Object.values(data).reduce((acc, dayData) => {
    return acc + dayData.reduce((daySum, item) => daySum + item.total, 0);
  }, 0);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (Object.keys(data).length === 0) {
    return (
      <View style={styles.noData}>
        <Text>No hay datos para mostrar.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {diasSemana.map(dia => (
        <View key={dia} style={styles.section}>
          <Text style={styles.sectionTitle}>{dia}</Text>
          {data[dia] ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Empleado</DataTable.Title>
                <DataTable.Title>Servicios</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>

              {data[dia].map(item => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.usuario}</DataTable.Cell>
                  <DataTable.Cell>
                    {item.servicios.map(servicio => servicio.nombre).join(', ')}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>${item.total}</DataTable.Cell>
                </DataTable.Row>
              ))}
              <DataTable.Row>
                <DataTable.Cell style={styles.totalLabel} colSpan={2}>
                  <Text style={styles.totalText}>Total del dia:</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={styles.totalText}>
                    ${data[dia].reduce((sum, item) => sum + item.total, 0)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          ) : (
            <Text style={styles.noDayData}>No hay datos para este día.</Text>
          )}
          <Divider style={styles.divider} />
        </View>
      ))}
      <View style={styles.totalSemana}>
        <Text style={styles.totalSemanaText}>Total de la semana:</Text>
        <Text style={styles.totalSemanaAmount}>${totalSemana}</Text>
      </View>
    </ScrollView>
  );
};

export default ReporteF;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  scrollContainer: {
    padding:10,
    paddingTop:20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"black"
  },
  noDayData: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  totalLabel: {
    justifyContent: 'flex-start',
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalSemana: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  totalSemanaText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalSemanaAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: 10,
  },
});
