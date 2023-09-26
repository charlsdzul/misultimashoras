import { Liquid } from "@ant-design/plots";
import { Col, DatePicker, Form, InputNumber, Layout, Row, Space } from "antd";
import locale from "antd/es/date-picker/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-animated-css";
import styles from "./CSS/styles.module.css";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";
const fechaHoy = dayjs();

const configGrafica = {
  percent: 0.25,
  outline: {
    border: 4,
    distance: 18
  },
  wave: {
    length: 100
  }
};

const App = () => {
  const [fechaNacimiento, setFechaNacimiendo] = useState(dayjs());
  const [agnosCreeVivir, setEdadCreeVivir] = useState(70);
  const [edadActual, setEdadActual] = useState(null);

  const fechaModificada = useRef(false);

  //const [fechaModificada, setFechaModificada] = useState(false);
  const [horasDuerme, setHorasDuerme] = useState(6);
  const [porcentajeVivido, setPorcentajeVivido] = useState(0);

  const [agnosRestantes, setAgnosRestantes] = useState(null);
  const [agnosRestantesDes, setAgnosRestantesDes] = useState(null);
  const [agnosRestantesDor, setAgnosRestantesDor] = useState(null);

  const [mesesRestantes, setMesesRestantes] = useState(null);
  const [mesesRestantesDor, setMesesRestantesDor] = useState(null);
  const [mesesRestantesDes, setMesesRestantesDes] = useState(null);

  const [diasRestantes, setDiasRestantes] = useState(null);
  const [diasRestantesDor, setDiasRestantesDor] = useState(null);
  const [diasRestantesDes, setDiasRestantesDes] = useState(null);

  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const format = (value) => {
    const truncate = truncateNumber(value);
    return Number(truncate).toLocaleString("en-US");
  };

  const timer = setInterval(() => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      clearInterval(timer);
    } else {
      if (time.seconds === 0) {
        if (time.minutes === 0) {
          setTime({
            hours: time.hours - 1,
            minutes: 59,
            seconds: 59
          });
        } else {
          setTime({
            hours: time.hours,
            minutes: time.minutes - 1,
            seconds: 59
          });
        }
      } else {
        setTime({
          hours: time.hours,
          minutes: time.minutes,
          seconds: time.seconds - 1
        });
      }
    }
  }, 1000);

  const calcularDiasTranscurridos = (horas) => {
    const diferenciaTiempoTranscurrido = fechaHoy - fechaNacimiento;
    const dias = diferenciaTiempoTranscurrido / (1000 * 3600 * 24);
    return dias;
  };

  const calcularTiempos = () => {
    clearInterval(timer);
    console.log("calcularTiempos");
    const horasXDia = 24;

    const diasTranscurridos = calcularDiasTranscurridos(horasXDia);
    const agnosTranscurridos = diasTranscurridos / 365;
    console.log("agnosTranscurridos", agnosTranscurridos);

    const agnosRestantes = agnosCreeVivir - agnosTranscurridos;
    const mesesRestantes = agnosRestantes * 12;
    const diasRestantes = agnosRestantes * 365;
    const horasRestantes = diasRestantes * 24;

    const agnosRestFormat = truncateNumber(agnosRestantes);
    const agnosRest =
      agnosRestFormat <= 0 ? "Menos de 1 año." : agnosRestFormat;

    const horasDespierto = horasXDia - horasDuerme;
    const agnosRestDes = (agnosRestantes / horasXDia) * horasDespierto;
    const agnosRestDor = agnosRestantes - agnosRestDes;

    setAgnosRestantes(agnosRest);
    setAgnosRestantesDes(format(agnosRestDes));
    setAgnosRestantesDor(format(agnosRestDor));

    const mesesRestDes = (mesesRestantes / horasXDia) * horasDespierto;
    const mesesRestDor = mesesRestantes - mesesRestDes;

    setMesesRestantes(format(mesesRestantes));
    setMesesRestantesDes(format(mesesRestDes));
    setMesesRestantesDor(format(mesesRestDor));

    const diasRestDes = (diasRestantes / horasXDia) * horasDespierto;
    const diasRestDor = diasRestantes - diasRestDes;

    setDiasRestantes(format(diasRestantes));
    setDiasRestantesDes(format(diasRestDes));
    setDiasRestantesDor(format(diasRestDor));

    const horasCronometro = Math.round(horasRestantes - 1).toLocaleString(
      "en-US"
    );

    setTime({
      hours: horasCronometro,
      minutes: 59,
      seconds: 59
    });

    const por = ((100 / agnosCreeVivir) * agnosTranscurridos) / 100;
    setPorcentajeVivido(por);

    setEdadActual(truncateNumber(agnosTranscurridos));
  };

  const truncateNumber = (number) => {
    const with2Decimals = number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return with2Decimals;
  };

  useEffect(() => {
    if (fechaModificada.current) calcularTiempos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaNacimiento, agnosCreeVivir, horasDuerme]);

  useEffect(() => {
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <Layout>
      <Space
        className={styles.content2}
        direction="vertical"
        size="middle"
        style={{ display: "flex" }}
      >
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
            xl={{ span: 24 }}
          >
            <Animated
              animationIn="bounceInLeft"
              animationOut="fadeOut"
              isVisible={true}
            >
              <div className={styles.infoHeader}>
                <h1>
                  Mis últimas horas
                  <span
                    className={styles.infoHeader_emoji}
                    role="img"
                    aria-label="emoji"
                  >
                    💀
                  </span>
                </h1>
                <h2>Calcula cuántas horas te quedan por vivir</h2>
              </div>
            </Animated>
          </Col>
        </Row>
      </Space>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Form
          layout="vertical"
          autoComplete="off"
          labelAlign="right"
          wrapperCol={{ flex: 1 }}
        >
          <Row justify="center" className={styles.entradas}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              ms={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <div className={styles.center}>
                <label className={styles.infoHeader_label}>
                  Fecha de nacimiento
                </label>
                <Form.Item>
                  <DatePicker
                    value={fechaNacimiento}
                    format={dateFormat}
                    locale={locale}
                    size="large"
                    onChange={(e) => {
                      fechaModificada.current = true;
                      setFechaNacimiendo(e);
                      // setFechaModificada(true);
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              ms={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <div className={styles.center}>
                <label className={styles.infoHeader_label}>
                  ¿Hasta quéedad crees que vivirás?
                </label>
                <Form.Item>
                  <InputNumber
                    min={parseInt(edadActual, 2)}
                    max={120}
                    size="large"
                    value={agnosCreeVivir}
                    disabled={!fechaModificada.current}
                    onChange={(e) => {
                      console.log(edadActual);
                      if (e > edadActual) {
                        fechaModificada.current = true;
                        setEdadCreeVivir(e);
                      }
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              ms={{ span: 8 }}
              lg={{ span: 8 }}
              xl={{ span: 8 }}
            >
              <div className={styles.center}>
                <label className={styles.infoHeader_label}>
                  ¿Cuántas horas duermes por día?
                </label>
                <Form.Item>
                  <InputNumber
                    min={1}
                    max={24}
                    size="large"
                    value={horasDuerme}
                    disabled={!fechaModificada.current}
                    onChange={(e) => {
                      fechaModificada.current = true;
                      setHorasDuerme(e);
                    }}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Space>

      {fechaModificada.current && (
        <>
          <Space
            className={styles.content1}
            direction="vertical"
            size="middle"
            style={{ display: "flex" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className={styles.cronometro}>
                  <span>{String(time.hours).padStart(2, "0")}:</span>
                  <span>{String(time.minutes).padStart(2, "0")}:</span>
                  <span>{String(time.seconds).padStart(2, "0")}</span>
                </div>
              </Col>

              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <div className={styles.info}>
                  <h2 style={{ color: "#f63434" }}>
                    En años, te quedan:
                    <br /> {agnosRestantes}
                  </h2>
                  <h3>
                    Despierto: {agnosRestantesDes} <br /> Dormido:{" "}
                    {agnosRestantesDor}
                  </h3>
                </div>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <div className={styles.info}>
                  <h2 style={{ color: "#f63434" }}>
                    En meses, te quedan: <br /> {mesesRestantes}
                  </h2>
                  <h3>
                    Despierto: {mesesRestantesDes} <br /> Dormido:{" "}
                    {mesesRestantesDor}
                  </h3>
                </div>
              </Col>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 8 }}
                md={{ span: 8 }}
                lg={{ span: 8 }}
                xl={{ span: 8 }}
              >
                <div className={styles.info}>
                  <h2 style={{ color: "#f63434" }}>
                    En dias, te quedan: <br /> {diasRestantes}
                  </h2>
                  <h3>
                    Despierto: {diasRestantesDes} <br /> Dormido:{" "}
                    {diasRestantesDor}
                  </h3>
                </div>
              </Col>
            </Row>
          </Space>

          <Space
            className={styles.content1}
            direction="vertical"
            size="middle"
            style={{ display: "flex" }}
          >
            <Row>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 24 }}
                xl={{ span: 24 }}
              >
                <div className={styles.infoHeader_label}>
                  <h1>Porcentaje vivido</h1>
                  <Liquid {...configGrafica} percent={porcentajeVivido} />
                </div>
              </Col>
            </Row>
          </Space>
        </>
      )}
    </Layout>
  );
};

export default App;
