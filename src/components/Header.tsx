import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [stats, setStats] = useState({
    hunts: 0,
    hearth: 0,
    elemental: 0,
    petrificatus: 0,
    tentacle: 0,
    incorruptible: 0,
    mechanil: 0,
  });

  const calculateStats = () => {
    const data = JSON.parse(localStorage.getItem("calendarData") || "{}");
    const keys = Object.keys(data);

    let hearth = 0;
    let elemental = 0;
    let petrificatus = 0;
    let tentacle = 0;
    let incorruptible = 0;
    let mechanil = 0;

    keys.forEach((key) => {
      const entry = data[key];
      hearth += entry.hearth || 0;
      elemental += entry.elemental || 0;
      petrificatus += entry.petrificatus || 0;
      tentacle += entry.tentacle || 0;
      incorruptible += entry.incorruptible || 0;
      mechanil += entry.mechanil || 0;
    });

    setStats({
      hunts: keys.length,
      hearth,
      elemental,
      petrificatus,
      tentacle,
      incorruptible,
      mechanil,
    });
  };

  useEffect(() => {
    // Executa calculateStats ao montar o componente
    calculateStats();

    // Escuta o evento `storage` para alterações feitas em outras abas
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "calendarData") {
        calculateStats();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Verifica alterações no localStorage na mesma aba
    const interval = setInterval(() => {
      calculateStats();
    }, 1000); // Verifica a cada 1 segundo

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    };
  }, []);

  const calculateDropChance = (item: number, hearth: number) => {
    return hearth > 0 ? ((item / hearth) * 100).toFixed(2) : "0.00";
  };

  const handleExport = () => {
    const data = localStorage.getItem("calendarData");
    const blob = new Blob([data || "{}"], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "calendarData.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        localStorage.setItem("calendarData", JSON.stringify(importedData));
        //alert("Dados importados com sucesso!");
        window.location.reload(); // Recarrega a página após a importação
      } catch (error) {
        //alert("Erro ao importar os dados. Verifique o arquivo e tente novamente.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="header">
      {/* Imagem no lado esquerdo */}
      <div className="header-left">
        <img src={`${import.meta.env.BASE_URL}images/darhon-head.png`} alt="Darhon Head" className="header-dragon" />
      </div>

      {/* Itens no meio */}
      <div className="header-center">
        <div className="header-stats">
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/hunts.png`} alt="Hunts" />
            {stats.hunts}
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/hearth.png`} alt="Hearth" />
            {stats.hearth}
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/elemental.png`} alt="Elemental" />
            {stats.elemental} / {calculateDropChance(stats.elemental, stats.hearth)}%
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/petrificatus.png`} alt="Petrificatus" />
            {stats.petrificatus} / {calculateDropChance(stats.petrificatus, stats.hearth)}%
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/tentacle.png`} alt="Tentacle" />
            {stats.tentacle} / {calculateDropChance(stats.tentacle, stats.hearth)}%
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/incorruptible.png`} alt="Incorruptible" />
            {stats.incorruptible} / {calculateDropChance(stats.incorruptible, stats.hearth)}%
          </div>
          <div className="stat-item">
            <img src={`${import.meta.env.BASE_URL}images/mechanil.png`} alt="Mechanil" />
            {stats.mechanil} / {calculateDropChance(stats.mechanil, stats.hearth)}%
          </div>
        </div>
      </div>

      {/* Botões no lado direito */}
      <div className="header-right">
        <label htmlFor="import-json" className="button import-button">
          Import
        </label>
        <input
          id="import-json"
          type="file"
          accept="application/json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
        <button className="button export-button" onClick={handleExport}>
          Export
        </button>
      </div>
    </header>
  );
};

export default Header;
