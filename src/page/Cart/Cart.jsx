import React, { useContext, useEffect, useState } from 'react';
import styles from "./Cart.module.css"
import CartDetail from "./Ui/CartDetail"
import UiModal from '../../shared/UI/UiModal/UiModal';
import { AppProviderContext } from '../../shared/Providers/AppProviders';
import useCartApi from './Api/UseCartApi';
import { ToastContainer, toast } from 'react-toastify';



export default function Cart() {

    const { post } = useCartApi();
    const [openModal, setOpenModal] = useState(false);
    const { removeCakeAction, cakeList, eventList, id, token } = useContext(AppProviderContext);
    const [total, setTotal] = useState(0);
    const calculaPreco = () => {
       const cakeValue = cakeList.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0)
       const eventValue = eventList.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0)
       setTotal( cakeValue + eventValue)
    }
    const handleDeleteCake = (cake) => {
        removeCakeAction(cake)
    }

    useEffect(() => {
        calculaPreco()
    },[cakeList])

    console.log(cakeList)
    console.log('event', eventList)

    const handleOrder = async () => {
        
        const formatedData = { cakeList, comboList: eventList, status: 'Aguardando pagamento', paymentDto: {amount: total, transferDate: Date.now()} }
        console.log(id)
        try {
            await post(token, formatedData, id)
            toast.success("Cadastro realizado com sucesso!", { position: toast.POSITION.TOP_CENTER });
            //navigate("/auth")
        } catch {
            toast.error("Não foi possível realizar seu cadastro, tente novamente.", { position: toast.POSITION.TOP_CENTER });
        }
    }

    return (
        <div className={styles.content}>
            <ToastContainer />
            <div className={styles.detailHeader}>
                <h3>PRODUTOS</h3>
                <div className={styles.detailHearderInfo}>
                    <h3>PREÇO UNI.</h3>
                </div>
            </div>
            {cakeList.map((data, index) => (
                <CartDetail cake={data} removeCake={handleDeleteCake} key={index} />
            ))}
            {eventList.map((data, index) => (
                <CartDetail cake={data} removeCake={handleDeleteCake} key={index} />
            ))}
            <div>
                <h3 className={styles.valueHeader}>TOTAL R${total}</h3>
            </div>
            <div className={styles.controlHeader}>
                <h3>Frete:</h3>
                <div className={styles.selectHead}>
                    <label htmlFor="frete">Retirar na loja</label>
                    <input id='frete' type='checkbox' />
                </div>

            </div>
            <div className={styles.controlHeader}>
                <h3>Informe a data e hora para retirada:</h3>
                <div className={styles.inputHeader}>
                    <label htmlFor="date"><strong>Data:</strong></label>
                    <input type="date" id="date" />
                </div>
                <div className={styles.inputHeader}>
                    <label htmlFor="time"><strong>Hora:</strong></label>
                    <input type="time" id="time" />
                </div>
            </div>
            <div className={styles.controlHeader}>
                <h3>Forma de pagamento:</h3>
                <div className={styles.selectHead}>
                    <label htmlFor="pagamento">PIX</label>
                    <input id='pagamento' type='checkbox' />
                </div>

            </div>
            <div className={styles.controlButton}>
                <button className={styles.button} onClick={() => handleOrder()}>Confirmar</button>
            </div>
            <UiModal isOpen={openModal} title='Pedido Realizado com Sucesso!' setModalOpen={() => setOpenModal(!openModal)}>
                <div className={styles.detailModal}>
                    <div>
                        <p><strong>Nº DO PEDIDO:</strong> 13044800</p>
                        <p><strong>DATA PEDIDO:</strong> 26/09/2023</p>
                    </div>
                    <div>
                        <strong>Bolo de fuba</strong>
                    </div>
                </div>
                <div className={styles.detailModal}>
                    <div>
                        <strong>Chave Pix:</strong> 45045450467840465604
                    </div>
                    <button className={styles.iconButton}><box-icon name='copy-alt'></box-icon></button>
                </div>

            </UiModal>
        </div>




    )

}