import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";
import { FaSpinner } from "react-icons/fa";

function Compatibilite() {
    const [person1, setPerson1] = useState({ name: '', dob: '', pob: '', tob: '' });
    const [person2, setPerson2] = useState({ name: '', dob: '', pob: '', tob: '' });
    const [compatibilityType, setCompatibilityType] = useState('');
    const [answer, setAnswer] = useState({ paragraphs: [], listItems: [] });
    const [tarotCheck, setTarotCheck] = useState(false);
    const [mbtiCheck, setMbtiCheck] = useState(false);
    const [mbtiProfile1, setMbtiProfile1] = useState("");
    const [mbtiProfile2, setMbtiProfile2] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePersonChange = (e, person) => {
        const { name, value } = e.target;
        person === 'person1' ? setPerson1({ ...person1, [name]: value }) : setPerson2({ ...person2, [name]: value });
    };

    const handleCompatibilityTypeChange = (e) => {
        setCompatibilityType(e.target.value);
    };

    const handleTarotCheckChange = (e) => {
        setTarotCheck(e.target.checked);
    };

    const handleMbtiCheckChange = (e) => {
        setMbtiCheck(e.target.checked);
    };

    const handleMbtiProfile1Change = (e) => {
        setMbtiProfile1(e.target.value);
    };

    const handleMbtiProfile2Change = (e) => {
        setMbtiProfile2(e.target.value);
    };

    let mbtiPromptInstruction1 = "";
    let mbtipromptAnalysis = "";
    let mbtiPromptInstruction2 = "";

    if (mbtiCheck) {
        mbtiPromptInstruction1 = `Profil MBTI: ${mbtiProfile1}`;
        mbtipromptAnalysis = `- Leur profils MBTI`
        mbtiPromptInstruction2 = `Profil MBTI: ${mbtiProfile2}`;
    }

    let tarotPromptInstruction = "";
    let tarotPromptAnalysis = ""
    if (tarotCheck) {
        tarotPromptInstruction = `
    Pour commencer, peux-tu tirer 13 cartes de tarot de marseilles au hasard et les indiquer dans ta r�ponse sous forme de liste ? Tu dois imp�rativement commencer la r�ponsee comme suit : 'Voici 13 cartes de tarot de Marseilles tir�es au hasard :'.
    `;
        tarotPromptAnalysis = `- L'analyse des cartes de tarots tir�es`
    }

    const createPrompt = (person1, person2, compatibilityType) => {
        return `Bonjour chatGPT, tu es astrologue, tu as �t� engag� par un client pour calculer sa compatibilit� ${compatibilityType} avec une autre personne.
              Voici les informations sur ton client :
              Pr�nom: ${person1.name}
              Date de naissance: ${person1.dob}
              Heure de naissance: ${person1.tob}
              Lieu de naissance: ${person1.pob}
              ${mbtiProfile1}

              Voici les informations sur la deuxieme personne :
              Pr�nom: ${person2.name}
              Date de naissance: ${person2.dob}
              Heure de naissance: ${person2.tob}
              Lieu de naissance: ${person2.pob}
              ${mbtiProfile2}

              ${tarotPromptInstruction}

              En t'aidant de l'analyse des �l�ments suivants peux-tu r�pondre � la question suivante : Est-ce que ${person1.name} et ${person2.name} ont une bonne compatibilit� ${compatibilityType} ?
              - Leur th�mes astrales,
              - Leur horoscopes pour l'ann�e 2023
              ${tarotPromptAnalysis}
              ${mbtipromptAnalysis}

              J'aimerais que tu r�ponde pr�cis�ment et que tu donnes des exemples dans ta r�ponse. Finis chaque paragraphe par un conseil personnalis�s, �vite les phrases trop g�n�ralistes. Aussi dans l'astrologie les gens sont plus sensibles aux conseils qui portent sur leurs relations et l'humain que sur le mat�riel. Conclu ta r�ponse avec une r�ponse par "oui" ou par "non" pour savoir si ces deux personnes sont compatibles.
              Enl�ve les formules d'incertitudes, nous savons que l'astrologie est inexacte, pas besoin de le rappeler. Romance un peu ta r�ponse. R�ponds en 1024 caract�res et fait des paragraphes courts. Adresse-toi directement au client en le vouvoyant.
              `;

        console.log(prompt)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) {
            alert("Veuillez remplir tous les champs requis.");
            return;
        }

        setLoading(true); // Afficher le loader

        const prompt = createPrompt(person1, person2, compatibilityType);

        try {
            const result = await axios.post(
                `https://api.openai.com/v1/engines/text-davinci-003/completions`,
                {
                    prompt,
                    max_tokens: 1024,
                    n: 1,
                    stop: null,
                    temperature: 1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer `,
                    },
                }
            );

            const generatedText = result.data.choices[0].text.trim();
            const listStart =
                "Voici 13 cartes de tarot de Marseilles tir�es au hasard :";
            const listEnd = ".";
            const listStartIndex = generatedText.indexOf(listStart);
            const listEndIndex = generatedText.indexOf(listEnd, listStartIndex);
            let listItems = [];

            if (listStartIndex >= 0 && listEndIndex > listStartIndex) {
                const listString = generatedText.slice(
                    listStartIndex + listStart.length,
                    listEndIndex
                );
                listItems = listString.split(",").map((item) => item.trim());
            }

            const paragraphs = generatedText
                .split("\n")
                .filter((paragraph, index) => index !== listStartIndex);

            setAnswer({ paragraphs, listItems });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data from OpenAI API:", error);
            setAnswer("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="Container">
            <form onSubmit={handleSubmit}>
                <div className="Form">
                    <div className="DoubleInputForm">

                        {/* Inputs for Person 1 */}
                        <div className="DoubleFormItem">
                            <h3>Personne 1</h3>
                            <div className="Form-astral">
                                <div>
                                    <label className="Form-label-astral">
                                        Pr�nom :
                                        <input
                                            className="Form-input-astral"
                                            type="text"
                                            name="name"
                                            value={person1.name}
                                            onChange={(e) => handlePersonChange(e, 'person1')}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Date de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="date"
                                            name="dob"
                                            value={person1.dob}
                                            onChange={(e) => handlePersonChange(e, 'person1')}
                                            required />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Lieu de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="text"
                                            name="pob"
                                            value={person1.pob}
                                            onChange={(e) => handlePersonChange(e, 'person1')}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Heure de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="time"
                                            name="tob"
                                            value={person1.tob} onChange={(e) => handlePersonChange(e, 'person1')}
                                            required />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Inputs for Person 2 */}
                        <div className="DoubleFormItem">
                            <h3>Personne 2</h3>
                            <div className="Form-astral">
                                <div>
                                    <label className="Form-label-astral">
                                        Pr�nom :
                                        <input
                                            className="Form-input-astral"
                                            type="text"
                                            name="name"
                                            value={person2.name}
                                            onChange={(e) => handlePersonChange(e, 'person2')}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Date de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="date"
                                            name="dob"
                                            value={person2.dob}
                                            onChange={(e) => handlePersonChange(e, 'person2')}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Lieu de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="text"
                                            name="pob"
                                            value={person2.pob}
                                            onChange={(e) => handlePersonChange(e, 'person2')}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label className="Form-label-astral">
                                        Heure de naissance :
                                        <input
                                            className="Form-input-astral"
                                            type="time"
                                            name="tob"
                                            value={person2.tob}
                                            onChange={(e) => handlePersonChange(e, 'person2')}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Radio buttons for compatibility type */}
                    <h3>Type de compatibilit�</h3>
                    <div className="radio-form">

                        <input
                            type="radio"
                            value="amoureuse"
                            checked={compatibilityType === "amoureuse"}
                            onChange={handleCompatibilityTypeChange}
                            id="amoureuse"
                            required
                        />
                        <label for="amoureuse">
                            Amoureuse
                        </label>

                        <input
                            type="radio"
                            value="professionnelle"
                            checked={compatibilityType === "professionnelle"}
                            onChange={handleCompatibilityTypeChange}
                            id="professionnelle"
                            required
                        />
                        <label for="professionnelle">
                            Professionnelle
                        </label>

                        <input
                            type="radio"
                            value="amicale"
                            checked={compatibilityType === "amicale"}
                            onChange={handleCompatibilityTypeChange}
                            id="amicale"
                            required
                        />
                        <label for="amicale">
                            Amicale
                        </label>
                    </div>

                    <div className="Form-Option">
                        <label className="Form-label-astral">
                            <input
                                className="Form-checkbox-astral"
                                type="checkbox"
                                checked={tarotCheck}
                                onChange={handleTarotCheckChange}
                            />
                            Cartes de tarot
                        </label>
                    </div>
                    <div className="Select-Mbti">
                        <label>
                            <input
                                type="checkbox"
                                checked={mbtiCheck}
                                onChange={handleMbtiCheckChange}
                            />
                            Profil MBTI
                        </label>
                        {mbtiCheck && (
                            <label>
                                Profil MBTI Personne 1
                                <select
                                    className="Switch-Mbti"
                                    value={mbtiProfile1}
                                    onChange={handleMbtiProfile1Change}
                                    required={mbtiCheck}
                                >
                                    <option value="">Choisissez un profil MBTI</option>
                                    <option value="ISTJ">ISTJ</option>
                                    <option value="ESTJ">ESTJ</option>
                                    <option value="ISTP">ISTP</option>
                                    <option value="ESTP">ESTP</option>
                                    <option value="ISFJ">ISFJ</option>
                                    <option value="ESFJ">ESFJ</option>
                                    <option value="ISFP">ISFP</option>
                                    <option value="ESFP">ESFP</option>
                                    <option value="INFJ">INFJ</option>
                                    <option value="ENFJ">ENFJ</option>
                                    <option value="INFP">INFP</option>
                                    <option value="ENFP">ENFP</option>
                                    <option value="INTP">INTP</option>
                                    <option value="ENTP">ENTP</option>
                                    <option value="INTJ">INTJ</option>
                                    <option value="ENTJ">ENTJ</option>
                                </select>
                            </label>
                        )}
                        {mbtiCheck && (
                            <label>
                                Profil MBTI Personne 2
                                <select
                                    className="Switch-Mbti"
                                    value={mbtiProfile2}
                                    onChange={handleMbtiProfile2Change}
                                    required={mbtiCheck}
                                >
                                    <option value="">Choisissez un profil MBTI</option>
                                    <option value="ISTJ">ISTJ</option>
                                    <option value="ESTJ">ESTJ</option>
                                    <option value="ISTP">ISTP</option>
                                    <option value="ESTP">ESTP</option>
                                    <option value="ISFJ">ISFJ</option>
                                    <option value="ESFJ">ESFJ</option>
                                    <option value="ISFP">ISFP</option>
                                    <option value="ESFP">ESFP</option>
                                    <option value="INFJ">INFJ</option>
                                    <option value="ENFJ">ENFJ</option>
                                    <option value="INFP">INFP</option>
                                    <option value="ENFP">ENFP</option>
                                    <option value="INTP">INTP</option>
                                    <option value="ENTP">ENTP</option>
                                    <option value="INTJ">INTJ</option>
                                    <option value="ENTJ">ENTJ</option>
                                </select>
                            </label>
                        )}
                    </div>

                    {/* Submit button */}
                    <div className="Button-submit-div">
                        <button className="Button" type="submit">
                            Calculer la compatibilit�
                        </button>
                    </div>
                </div>
            </form>

            {/* Display the response */}
            {loading ? (
                <div className="Loader">
                    <FaSpinner className="Spinner" />
                </div>
            ) : (
                <div className="Reponse-paragraphs">
                    {answer.paragraphs.length > 0 && (
                        <div>
                            <h2>R�ponse :</h2>
                            {tarotCheck && (
                                <>
                                    <p>Voici 13 cartes de tarot de Marseilles tir�es au hasard :</p>
                                    {answer.listItems.length > 0 && (
                                        <ul>
                                            {answer.listItems.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                            {answer.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Compatibilite;
