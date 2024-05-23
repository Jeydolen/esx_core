function handleSalary(job, jobLabel, salary, player, xPlayer)
    if salary > 0 then
        if job == "unemployed" or job == "unemployed2" then -- unemployed
            xPlayer.addAccountMoney("bank", salary, "Welfare Check")
            TriggerClientEvent("esx:showAdvancedNotification", player, TranslateCap("bank"), TranslateCap("received_paycheck"), TranslateCap("received_help", salary), "CHAR_BANK_MAZE", 9)
            if Config.LogPaycheck then
                ESX.DiscordLogFields("Paycheck", "Paycheck - Unemployment Benefits", "green", {
                    { name = "Player", value = xPlayer.name, inline = true },
                    { name = "ID", value = xPlayer.source, inline = true },
                    { name = "Amount", value = salary, inline = true },
                })
            end
        elseif Config.EnableSocietyPayouts then -- possibly a society
            TriggerEvent("esx_society:getSociety", xPlayer.job.name, function(society)
                if society ~= nil then -- verified society
                    TriggerEvent("esx_addonaccount:getSharedAccount", society.account, function(account)
                        if account.money >= salary then -- does the society money to pay its employees?
                            xPlayer.addAccountMoney("bank", salary, "Paycheck")
                            account.removeMoney(salary)
                            if Config.LogPaycheck then
                                ESX.DiscordLogFields("Paycheck", "Paycheck - " .. jobLabel, "green", {
                                    { name = "Player", value = xPlayer.name, inline = true },
                                    { name = "ID", value = xPlayer.source, inline = true },
                                    { name = "Amount", value = salary, inline = true },
                                })
                            end

                            TriggerClientEvent("esx:showAdvancedNotification", player, TranslateCap("bank"), TranslateCap("received_paycheck"), TranslateCap("received_salary", salary), "CHAR_BANK_MAZE", 9)
                        else
                            TriggerClientEvent("esx:showAdvancedNotification", player, TranslateCap("bank"), "", TranslateCap("company_nomoney"), "CHAR_BANK_MAZE", 1)
                        end
                    end)
                else -- not a society
                    xPlayer.addAccountMoney("bank", salary, "Paycheck")
                    if Config.LogPaycheck then
                        ESX.DiscordLogFields("Paycheck", "Paycheck - " .. jobLabel, "green", {
                            { name = "Player", value = xPlayer.name, inline = true },
                            { name = "ID", value = xPlayer.source, inline = true },
                            { name = "Amount", value = salary, inline = true },
                        })
                    end
                    TriggerClientEvent("esx:showAdvancedNotification", player, TranslateCap("bank"), TranslateCap("received_paycheck"), TranslateCap("received_salary", salary), "CHAR_BANK_MAZE", 9)
                end
            end)
        else -- generic job
            xPlayer.addAccountMoney("bank", salary, "Paycheck")
            if Config.LogPaycheck then
                ESX.DiscordLogFields("Paycheck", "Paycheck - Generic", "green", {
                    { name = "Player", value = xPlayer.name, inline = true },
                    { name = "ID", value = xPlayer.source, inline = true },
                    { name = "Amount", value = salary, inline = true },
                })
            end
            TriggerClientEvent("esx:showAdvancedNotification", player, TranslateCap("bank"), TranslateCap("received_paycheck"), TranslateCap("received_salary", salary), "CHAR_BANK_MAZE", 9)
        end
    end
end

function StartPayCheck()
    CreateThread(function()
        while true do
            Wait(Config.PaycheckInterval)
            for player, xPlayer in pairs(ESX.Players) do
                -- Job 1
                local jobLabel = xPlayer.job.label
                local job = xPlayer.job.grade_name
                local salary = xPlayer.job.grade_salary
                handleSalary(job, jobLabel, salary, player, xPlayer)

                -- Job 2
                local job2Label = xPlayer.job2.label
                local job2 = xPlayer.job2.grade_name
                local salary2 = xPlayer.job2.grade_salary
                handleSalary(job2, job2Label, salary2, player, xPlayer)
            end
        end
    end)
end
