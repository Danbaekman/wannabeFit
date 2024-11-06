import React, { useState, useEffect } from 'react';
import { View, Text, Button, Picker } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const ChartScreen = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [range, setRange] = useState(3); // 기본 범위는 3개월

    const fetchChartData = () => {
        console.log("Fetching data from:", startDate, "to:", endDate);
        // 이곳에서 백엔드 API 호출하여 startDate와 endDate 범위의 데이터 가져오기
    };

    // 사용자가 범위를 변경할 때마다 시작 날짜를 업데이트
    useEffect(() => {
        const newStartDate = new Date();
        newStartDate.setMonth(newStartDate.getMonth() - range);
        setStartDate(newStartDate);
    }, [range]);

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>운동 기록 차트</Text>

            {/* 기간 선택 드롭다운 */}
            <Picker
                selectedValue={range}
                onValueChange={(itemValue) => setRange(itemValue)}
                style={{ height: 50, width: 150 }}
            >
                <Picker.Item label="3개월" value={3} />
                <Picker.Item label="6개월" value={6} />
                <Picker.Item label="1년" value={12} />
            </Picker>

            {/* 차트 예시 */}
            <LineChart
                data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
                    datasets: [
                        {
                            data: [20, 45, 28, 80, 99, 43],
                            color: () => `rgba(134, 65, 244, 1)`, // 라인 색상 설정
                        }
                    ]
                }}
                width={screenWidth}
                height={220}
                yAxisSuffix="kg"
                chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // 소수점 자리
                    color: () => `rgba(255, 255, 255, 0.7)`,
                    labelColor: () => `rgba(255, 255, 255, 0.7)`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                }}
                style={{ marginVertical: 8, borderRadius: 16 }}
            />

            <Button title="데이터 업데이트" onPress={fetchChartData} />
        </View>
    );
};

export default ChartScreen;
