<div id="page-add-order" class="page-content hidden">
            <section class="input-section">
                <h2>Catat Order Baru</h2>
                <form id="journalForm">
                    <label for="pair">Pair</label>
                    <input type="text" id="pair" name="pair" value="BTCIDR" required>
                    <label for="entry">Harga Entry</label>
                    <input type="number" id="entry" name="entry" step="any" required>
                    <label for="takeProfit">Take Profit</label>
                    <input type="number" id="takeProfit" name="takeProfit" step="any" required>
                    <label for="stopLoss">Stop Loss</label>
                    <input type="number" id="stopLoss" name="stopLoss" step="any" required>
                    <label for="timeframe">Timeframe</label>
                    <input type="text" id="timeframe" name="timeframe" value="1H" required>
                    <label for="duration">Jenis Order</label>
                    <select id="duration" name="duration" required>
                        <option value="Long">Long</option>
                        <option value="Short">Short</option>
                    </select>
                    <button type="submit">Catat Order</button>
                </form>
            </section>
        </div>