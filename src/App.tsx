import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import logo from './assets/logo.png'

import './App.css'

function App() {
  /** variaveis globais */
  const totalDiasNoMes = 30;

  /** Informações Inseridas Manualmente */
  const [consumoMedioMensal, setConsumoMedioMensal] = useState(Number)
  const [potenciaModulos, setPotenciaModulos] = useState(Number)
  const [quantidadePlacasInstalar, setQuantidadePlacasInstalar] = useState(Number)
  /** Informações Inseridas Automaticamente baseadas nas Manualmente */
  const [mediaDiariaCliente, setMediaDiariaCliente] = useState(0)
  const [potenciaPicoSistema, setPotenciaPicoSistema] = useState(0)
  const [quantidadePlacas, setQuantidadePlacas] = useState(0)
  const [potenciaReal, setPotenciaReal] = useState(0)
  const [potenciaInversorMenos, setPotenciaInversorMenos] = useState(0)
  const [potenciaInversorMais, setPotenciaInversorMais] = useState(0)
  const [consumoAtendido, setConsumoAtendido] = useState(0)
  const [azimutal, setAzimutal] = useState('Norte')
  const [conversaoKwpToKwh, setConversaoKwpToKwh] = useState(0)
  /** valor referente a cada Mês */
  const [janeiro, setJaneiro] = useState(5.31)
  const [fevereiro, setFevereiro] = useState(5.48)
  const [marco, setMarco] = useState(5.53)
  const [abril, setAbril] = useState(5.37)
  const [maio, setMaio] = useState(4.67)
  const [junho, setJunho] = useState(4.57)
  const [julho, setJulho] = useState(4.68)
  const [agosto, setAgosto] = useState(5.40)
  const [setembro, setSetembro] = useState(5.12)
  const [outubro, setOutubro] = useState(5.40)
  const [novembro, setNovembro] = useState(5.59)
  const [dezembro, setDezembro] = useState(5.68)
  /** Configurações do Gráfico Chart.js2 */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Gráfico - Consumo Médio Mensal',
      },
    },
  };

  const labels = ['Jan ' + calculoKwhMes(janeiro), 'Fev ' + calculoKwhMes(fevereiro), 'Mar ' + calculoKwhMes(marco),
  'Abr ' + calculoKwhMes(abril), 'Mai ' + calculoKwhMes(maio), 'Jun ' + calculoKwhMes(junho), 'Jul ' + calculoKwhMes(julho),
  'Ago ' + calculoKwhMes(agosto), 'Set ' + calculoKwhMes(setembro), 'Out ' + calculoKwhMes(outubro),
  'Nov ' + calculoKwhMes(novembro), 'Dez ' + calculoKwhMes(dezembro)];

  const data = {
    labels,
    datasets: [
      {
        label: 'Quantidade Total kWh/Mês',
        data: [
          calculoKwhMes(janeiro),
          calculoKwhMes(fevereiro),
          calculoKwhMes(marco),
          calculoKwhMes(abril),
          calculoKwhMes(maio),
          calculoKwhMes(junho),
          calculoKwhMes(julho),
          calculoKwhMes(agosto),
          calculoKwhMes(setembro),
          calculoKwhMes(outubro),
          calculoKwhMes(novembro),
          calculoKwhMes(dezembro)
        ],
        backgroundColor: ['rgba(255, 162, 1, 0.5)']
      }
    ],
  };


  useEffect(() => {
    calculoMediaDiariaCliente(consumoMedioMensal, totalDiasNoMes)
    calculoPotenciaPicoSistema(consumoMedioMensal, totalDiasNoMes, azimutal)
    calculoQuantidadesPlacas(potenciaPicoSistema, potenciaModulos)
    calculoPotenciaReal(potenciaModulos, quantidadePlacasInstalar)
    calculoPotenciaInversor(quantidadePlacasInstalar, potenciaModulos)
    calculoConsumoAtendido(potenciaReal, potenciaPicoSistema)
  }, [consumoMedioMensal, potenciaModulos, quantidadePlacasInstalar, potenciaReal, potenciaPicoSistema, azimutal, conversaoKwpToKwh])

  function calculoKwhMes(valor: number) {
    let resultado = ((((valor * totalDiasNoMes) * (85 * 100)) / 10000) * potenciaReal)
    resultado = Number(resultado.toFixed(2))
    return resultado
  }

  const calculoPotenciaPicoSistema = (consumoMedioMensal: number, totalDiasNoMes: number, azimutal: string) => {

    let norte = 1.2;
    let leste = (1.2) * (1.1);
    let oeste = (1.2) * (1.2);

    let selecao = norte;

    if (azimutal == 'Norte') {
      selecao = norte
    } else if (azimutal == 'Leste') {
      selecao = leste
    } else if (azimutal == 'Oeste') {
      selecao = oeste
    } else {
      alert('Algo deu errado no calculo da Potência do Pico do Sistema, atualize a página.')
    }

    let resultado = ((consumoMedioMensal / totalDiasNoMes) / (5.23) * (selecao))
    resultado = Number(resultado.toFixed(2))
    setPotenciaPicoSistema(resultado)
  }

  const calculoQuantidadesPlacas = (potenciaPicoSistema: number, potenciaModulos: number) => {
    let resultado = ((potenciaPicoSistema * 1000) / (potenciaModulos))
    setQuantidadePlacas(resultado)
  }

  const calculoPotenciaReal = (potenciaModulos: number, quantidadePlacasInstalar: number) => {
    let resultado = ((potenciaModulos * quantidadePlacasInstalar) / 1000)
    resultado = Number(resultado.toFixed(2))
    setPotenciaReal(resultado)
  }

  const calculoMediaDiariaCliente = (consumoMedioMensal: number, totalDiasNoMes: number) => {
    let resultado = (consumoMedioMensal / totalDiasNoMes)
    resultado = Number(resultado.toFixed(2))
    setMediaDiariaCliente(resultado)
  }

  const calculoPotenciaInversor = (quantidadePlacasInstalar: number, potenciaModulos: number) => {
    let resultadoParaMenos = ((quantidadePlacasInstalar * (0.8) * potenciaModulos) / 1000)
    let resultadoParaMais = ((quantidadePlacasInstalar * (1.2) * potenciaModulos) / 1000)

    resultadoParaMenos = Number(resultadoParaMenos.toFixed(2))
    resultadoParaMais = Number(resultadoParaMais.toFixed(2))

    setPotenciaInversorMenos(resultadoParaMenos)
    setPotenciaInversorMais(resultadoParaMais)
  }

  const calculoConsumoAtendido = (potenciaReal: number, potenciaPicoSistema: number) => {
    let resultado = Number(((potenciaReal / potenciaPicoSistema) * 100).toFixed(2))
    resultado = Math.round(resultado)
    setConsumoAtendido(resultado)
  }

  const calculoConversaoKwPtoKwH = (valorParaConverter: number) => {
    let resultado = ((5.23 * totalDiasNoMes) * valorParaConverter) * ((85) / 100)
    resultado = Number(resultado.toFixed(2))
    return resultado
  }

  function mediaKhwMes() {
    let resultado = ((calculoKwhMes(janeiro) +
      calculoKwhMes(fevereiro) +
      calculoKwhMes(marco) +
      calculoKwhMes(abril) +
      calculoKwhMes(maio) +
      calculoKwhMes(junho) +
      calculoKwhMes(julho) +
      calculoKwhMes(agosto) +
      calculoKwhMes(setembro) +
      calculoKwhMes(outubro) +
      calculoKwhMes(novembro) +
      calculoKwhMes(dezembro)) / 12)

    return resultado
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '500px', background: '#fff', display: 'flex', justifyContent: 'center', borderRadius: '30px' }}>
          <img src={logo} alt="Logomarca" width={'300px'} />
        </div>
      </div>

      <div className="container">
        <div className="card">
          <strong>Dados:</strong>
          <br />
          <p>
            Consumo Médio Mensal: <input type="number" onChange={(e) => { setConsumoMedioMensal(e.target.valueAsNumber) }} style={{ width: '50px', marginBottom: '5px', padding: '5px', border: '1px solid #F7541A', borderRadius: '10px', background: '#fff' }} /> kWh
          </p>
          <p>
            Potência dos Módulos: <input type="number" onChange={(e) => { setPotenciaModulos(e.target.valueAsNumber) }} style={{ width: '50px', marginBottom: '5px', padding: '5px', border: '1px solid #F7541A', borderRadius: '10px', background: '#fff' }} /> kWh
          </p>
          <p>
            Azimutal: <select value={azimutal} onChange={(e) => { setAzimutal(e.target.value) }}>
              <option value="Norte">Norte</option>
              <option value="Leste">Leste</option>
              <option value="Oeste">Oeste</option>
            </select>
          </p>
          <p>
            Quantidade Necessária de Placas: {Math.floor(quantidadePlacas)} ou {Math.ceil(quantidadePlacas)}.
          </p>
          <p>

            Placas a Instalar: <input type="number" onChange={(e) => { setQuantidadePlacasInstalar(e.target.valueAsNumber) }} style={{ width: '40px', marginTop: '5px', marginBottom: '5px', padding: '5px', border: '1px solid #F7541A', borderRadius: '10px', background: '#fff' }} /> unidade(s).
          </p>
          <p>
            <input type="number" onChange={(e) => { setConversaoKwpToKwh(e.target.valueAsNumber) }}
              style={{
                width: '40px', marginTop: '5px', marginBottom: '5px',
                padding: '5px', border: '1px solid #F7541A', borderRadius: '10px', background: '#fff'
              }} /> kWp para {calculoConversaoKwPtoKwH(conversaoKwpToKwh)} kWh.
          </p>
        </div>

        <div className="card">
          <strong>Resultados:</strong>
          <br />
          <p>
            Consumo Médio Mensal: {consumoMedioMensal} kWh <br />
          </p>
          <p>
            Potência dos Modulos: {potenciaModulos} kWh
          </p>
          <p>
            Média Diária Cliente: {mediaDiariaCliente} kWh
          </p>
          <p>
            Potência Pico Sistema: {potenciaPicoSistema} kWp
          </p>
          <p>
            Placas a Instalar no Local: {quantidadePlacasInstalar}
          </p>
          <p>
            Potência Real: {potenciaReal} kWp
          </p>
          <p>
            Potência do Inversor: {potenciaInversorMenos}K ou {potenciaInversorMais}K
          </p>
          <p>
            Consumo Atendido: {consumoAtendido}%
          </p>
          <p>
            Produção Mensal Estimada: {Math.ceil(mediaKhwMes())} kWh
          </p>
        </div>
        <div style={{ width: '50%', marginTop: '50px' }}>
          < Bar options={options} data={data} />
        </div>
      </div>

      <div className="container">
        <p style={{ color: '#555' }}>Desenvolvido por <a href="https://api.whatsapp.com/send?phone=5567992817962&text=Ol%C3%A1%2C%20estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20projeto%20TecSollis%20App." target="_blank" style={{ color: '#555' }}> Thiago.</a></p>
      </div>
    </div >

  )
}

export default App
