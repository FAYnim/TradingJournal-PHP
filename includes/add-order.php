<div id="page-add-order" class="page-content hidden">
            <section class="card">
                <h2>Catat Order Baru</h2>
                <form id="journalForm">
                    <div class="form-group">
                        <label for="pair">Pair</label>
                        <input type="text" id="pair" name="pair" value="BTCIDR" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="entry">Harga Entry</label>
                        <input type="number" id="entry" name="entry" step="any" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="takeProfit">Take Profit</label>
                        <input type="number" id="takeProfit" name="takeProfit" step="any" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="stopLoss">Stop Loss</label>
                        <input type="number" id="stopLoss" name="stopLoss" step="any" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="timeframe">Timeframe</label>
                        <input type="text" id="timeframe" name="timeframe" value="1H" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="duration">Jenis Order</label>
                        <select id="duration" name="duration" class="form-control" required>
                            <option value="Long">Long</option>
                            <option value="Short">Short</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Catat Order</button>
                </form>
            </section>
        </div>