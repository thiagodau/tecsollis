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
  /** valor referente a cada Mês */
  const [janeiro, setJaneiro] = useState(0)
  const [fevereiro, setFevereiro] = useState(0)
  const [marco, setMarco] = useState(0)
  const [abril, setAbril] = useState(0)
  const [maio, setMaio] = useState(0)
  const [junho, setJunho] = useState(0)
  const [julho, setJulho] = useState(0)
  const [agosto, setAgosto] = useState(0)
  const [setembro, setSetembro] = useState(0)
  const [outubro, setOutubro] = useState(0)
  const [novembro, setNovembro] = useState(0)
  const [dezembro, setDezembro] = useState(0)
  /** Configurações do Gráfico Chart.js2 */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Consumo Médio Mensal',
      },
    },
  };

  const labels = ['Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

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
        backgroundColor: ['rgba(255, 162, 1, 0.5)'],
      }
    ],
  };


  useEffect(() => {
    calculoMediaDiariaCliente(consumoMedioMensal, totalDiasNoMes)
    calculoPotenciaPicoSistema(consumoMedioMensal, totalDiasNoMes)
    calculoQuantidadesPlacas(potenciaPicoSistema, potenciaModulos)
    calculoPotenciaReal(potenciaModulos, quantidadePlacasInstalar)
    calculoPotenciaInversor(quantidadePlacasInstalar, potenciaModulos)
    calculoConsumoAtendido(potenciaReal, potenciaPicoSistema)
  }, [consumoMedioMensal, potenciaModulos, quantidadePlacasInstalar, potenciaReal, potenciaPicoSistema])

  function calculoKwhMes(valor: number) {
    let resultado = ((((valor * 30) * (85 * 100)) / 10000) * potenciaReal)
    resultado = Number(resultado.toFixed(2))
    return resultado
  }

  const calculoPotenciaPicoSistema = (consumoMedioMensal: number, totalDiasNoMes: number) => {
    let resultado = ((consumoMedioMensal / totalDiasNoMes) / (5.23) * (1.2))
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
    let resultado = ((potenciaReal / potenciaPicoSistema) * 100)
    resultado = Math.floor(resultado)
    setConsumoAtendido(resultado)
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
    <div style={{ margin: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={logo} alt="Logomarca" width={'300px'} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ margin: '10px 20px 0 20px' }}>
          Consumo Médio Mensal: <input type="number" onChange={(e) => { setConsumoMedioMensal(e.target.valueAsNumber) }} style={{ width: '50px', marginBottom: '5px', padding: '5px' }} /> kWh
          <br />
          Potência dos Módulos: <input type="number" onChange={(e) => { setPotenciaModulos(e.target.valueAsNumber) }} style={{ width: '50px', marginBottom: '5px', padding: '5px' }} /> kWh
          <br />
          Média Diária do Cliente: {mediaDiariaCliente}kWh
          <br />
          Quantidade Necessária de Placas: {Math.floor(quantidadePlacas)} ou {Math.ceil(quantidadePlacas)} placas.
          <br />
          Placas a Instalar: <input type="number" onChange={(e) => { setQuantidadePlacasInstalar(e.target.valueAsNumber) }} style={{ width: '40px', marginTop: '5px', marginBottom: '5px', padding: '5px' }} />
          <br />
          Potência Pico Sistema: {potenciaPicoSistema}kWp
          <br />
          Potência Real: {potenciaReal}kWp
          <br />
          Potência do Inversor (menos): {potenciaInversorMenos}K
          ou (mais): {potenciaInversorMais}K
          <br />
          Produção Mensal Estimada: {Math.ceil(mediaKhwMes())} kWh
          <br />
          Consumo Atendido: {consumoAtendido}%
          <br />
        </div>
        <div style={{ margin: '10px 20px 0 20px' }}>
          <p>
            Dados Informados:
            <li>Consumo Médio Mensal: {consumoMedioMensal} kWh</li>
            <li>Potência dos Modulos: {potenciaModulos} kWh</li>
            <li>Média Diária Cliente: {mediaDiariaCliente} kWh</li>
            <li>Potência Pico Sistema: {potenciaPicoSistema} kWp</li>
            <li>Placas a Instalar no Local: {quantidadePlacasInstalar} placas</li>
            <li>Quantidade Necessaria (p/ -): {Math.floor(quantidadePlacas)} placas ou (p/ +): {Math.ceil(quantidadePlacas)} placas</li>
            <li>Potência Real: {potenciaReal} kWp</li>
            <li>Potência do Inversor (menos): {potenciaInversorMenos}K
              ou (mais): {potenciaInversorMais}K</li>
            <li>Consumo Atendido: {consumoAtendido}%</li>
            <li>Produção Mensal Estimada: {Math.ceil(mediaKhwMes())} kWh</li>
          </p>
        </div>
        <div style={{ margin: '10px 20px 0 20px' }}>
          <table>
            <thead>
              <tr>
                <th> Dados Creceb </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Meses</td>
                <td> HSP Aquid.</td>
                <td> kWh/m</td>
              </tr>
              <tr>
                <td> Jan </td>
                <td> <input type="number" onChange={(e) => { setJaneiro(e.target.valueAsNumber) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(janeiro)}</td>
              </tr>
              <tr>
                <td> Fev </td>
                <td> <input type="number" onChange={(e) => { setFevereiro((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(fevereiro)}</td>
              </tr>
              <tr>
                <td> Mar </td>
                <td> <input type="number" onChange={(e) => { setMarco((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(marco)}</td>
              </tr>
              <tr>
                <td> Abr </td>
                <td> <input type="number" onChange={(e) => { setAbril((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(abril)}</td>
              </tr>
              <tr>
                <td> Mai </td>
                <td> <input type="number" onChange={(e) => { setMaio((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(maio)}</td>
              </tr>
              <tr>
                <td> Jun </td>
                <td> <input type="number" onChange={(e) => { setJunho((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(junho)}</td>
              </tr>
              <tr>
                <td> Jul </td>
                <td> <input type="number" onChange={(e) => { setJulho((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(julho)}</td>
              </tr>
              <tr>
                <td> Ago </td>
                <td> <input type="number" onChange={(e) => { setAgosto((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(agosto)}</td>
              </tr>
              <tr>
                <td> Set </td>
                <td> <input type="number" onChange={(e) => { setSetembro((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(setembro)}</td>
              </tr>
              <tr>
                <td> Out </td>
                <td> <input type="number" onChange={(e) => { setOutubro((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(outubro)}</td>
              </tr>
              <tr>
                <td> Nov </td>
                <td> <input type="number" onChange={(e) => { setNovembro((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(novembro)}</td>
              </tr>
              <tr>
                <td> Dez </td>
                <td> <input type="number" onChange={(e) => { setDezembro((e.target.valueAsNumber)) }} style={{ width: '60px' }} /></td>
                <td> {calculoKwhMes(dezembro)}</td>
              </tr>

              <tr>
                <td> Média 20º N </td>
                <td><strong> {((janeiro + fevereiro + marco + abril + maio + junho + julho + agosto + setembro + outubro + novembro + dezembro) / 12).toFixed(2)} </strong></td>
                <td><strong>{mediaKhwMes().toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>




      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ width: '50%' }}>
          < Bar options={options} data={data} />
        </div>
      </div>
    </div >

  )
}

export default App
